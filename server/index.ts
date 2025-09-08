import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Robust path helper for Docker/container environments
function getProjectRoot(): string {
  try {
    // Try to use import.meta.url first (modern Node.js)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, "..");
  } catch (error) {
    // Fallback for environments where import.meta is not available
    console.log("Falling back to process.cwd() for path resolution");
    return process.cwd();
  }
}

// Validate required environment variables at startup
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missing = requiredEnvVars.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  // Set NODE_ENV to production if not explicitly set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    console.log('NODE_ENV not set, defaulting to production');
  }
  
  // Log base URL for Google OAuth configuration
  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : `https://3d2437f9e7f2.replit.app`;
  console.log('BASE_URL:', baseUrl);
  console.log('Google OAuth URLs:');
  console.log('  Authorized JavaScript origins:', baseUrl);
  console.log('  Authorized redirect URIs:', `${baseUrl}/api/auth/google/callback`);
}

// Validate environment before starting the server
validateEnvironment();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Graceful shutdown handling
let server: any = null;

const gracefulShutdown = (signal: string) => {
  log(`Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      log('HTTP server closed.');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      log('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

(async () => {
  try {
    server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    
    // Force production mode in Docker/container environments to avoid vite.ts import.meta issues
    const isProduction = process.env.NODE_ENV === "production" || 
                        !process.env.REPLIT_DEV_DOMAIN ||
                        process.env.EASYPANEL === "true" ||
                        app.get("env") === "production";
    
    console.log(`Environment detection:`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  app.get("env"): ${app.get("env")}`);
    console.log(`  REPLIT_DEV_DOMAIN: ${process.env.REPLIT_DEV_DOMAIN || 'not set'}`);
    console.log(`  Using production mode: ${isProduction}`);
    
    if (!isProduction) {
      console.log("Starting Vite development server...");
      await setupVite(app, server);
    } else {
      console.log("Starting production static file server...");
      // Serve static files in production with robust absolute paths
      const projectRoot = getProjectRoot();
      
      // Correct path: files are built to dist/public (not client/dist)
      const distPath = path.resolve(projectRoot, "dist", "public");
      
      console.log(`Looking for static files in: ${distPath}`);
      
      // Verify the dist directory exists
      if (!fs.existsSync(distPath)) {
        console.error(`Build directory not found: ${distPath}`);
        console.error("Available directories:");
        try {
          const projectContents = fs.readdirSync(projectRoot);
          console.error(`Project root contents: ${projectContents.join(', ')}`);
          
          const distDir = path.resolve(projectRoot, "dist");
          if (fs.existsSync(distDir)) {
            const distContents = fs.readdirSync(distDir);
            console.error(`Dist directory contents: ${distContents.join(', ')}`);
          }
        } catch (e) {
          console.error("Could not read directory contents");
        }
        console.error("Make sure to run 'npm run build' before starting in production");
        process.exit(1);
      }
      
      console.log(`Successfully found static files at: ${distPath}`);
      
      // Serve static files from dist/public
      app.use(express.static(distPath));
      
      // Fallback to index.html for client-side routing (SPA)
      app.use("*", (_req, res) => {
        const indexPath = path.resolve(distPath, "index.html");
        console.log(`Attempting to serve index.html from: ${indexPath}`);
        
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`index.html not found at: ${indexPath}`);
          res.status(404).send("index.html not found - application not built properly");
        }
      });
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });

    // Handle server listen errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('Critical error during server startup:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Additional error details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    
    console.error('Environment details:');
    console.error('  Working directory:', process.cwd());
    console.error('  Node version:', process.version);
    console.error('  Platform:', process.platform);
    console.error('  Architecture:', process.arch);
    
    process.exit(1);
  }
})();
