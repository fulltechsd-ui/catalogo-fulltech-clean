import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/ProductDetail";
import { Login } from "@/pages/Login";
import { CustomerDashboard } from "@/pages/CustomerDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Warranty from "@/pages/Warranty";
import Refund from "@/pages/Refund";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CustomPage from "@/pages/CustomPage";
import { Footer } from "@/components/Footer";

function Router() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePathChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  // Check for hash-based custom page routing
  const isCustomPage = currentHash && currentHash.startsWith('#page=');
  
  // Check if current page should show footer (only home page)
  const shouldShowFooter = currentPath === '/' && !isCustomPage;
  
  if (isCustomPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <CustomPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className={`flex-1 ${shouldShowFooter ? 'pb-16' : ''}`}>
        <Switch>
          <Route path="/" component={Catalog} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/login" component={Login} />
          <Route path="/customer/dashboard" component={CustomerDashboard} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/garantia" component={Warranty} />
          <Route path="/reembolsos" component={Refund} />
          <Route path="/privacidad" component={Privacy} />
          <Route path="/terminos" component={Terms} />
          <Route path="/sobre-nosotros" component={About} />
          <Route path="/contacto" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
