// NUEVO CÓDIGO COMPLETO Y VERIFICADO - Reemplaza todo el archivo
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Response } from "express";
import { randomUUID } from "crypto";
import { Readable } from "stream";

// 1. Configuración del cliente S3. Automáticamente lee los nuevos Secrets.
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1', // Valor estándar, no es crítico para SeaweedFS/MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true, // ¡Muy importante para que funcione con SeaweedFS!
});

// Extraer el nombre del bucket de los Secrets para usarlo fácilmente
const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

// 2. Definimos un error personalizado, igual que en tu código original
export class ObjectNotFoundError extends Error {
  constructor(message = "Object not found") {
    super(message);
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// 3. Nueva clase de servicio de almacenamiento, imitando la estructura de la tuya
export class ObjectStorageService {

  // Función para verificar si un objeto existe
  private async fileExists(objectKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      });
      await s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error; // Lanza otros errores
    }
  }

  // Genera una URL firmada para que el frontend pueda subir un archivo.
  // Reemplaza a tu 'getObjectEntityUploadURL' original.
  async getObjectEntityUploadURL(): Promise<{ uploadUrl: string; objectPath: string }> {
    // Generamos un nombre único para el archivo para evitar colisiones.
    // Lo guardamos en una carpeta 'uploads' dentro del bucket.
    const objectKey = `uploads/${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    // Genera la URL de subida con una validez de 15 minutos (900 segundos)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    // Devolvemos la URL y la ruta/llave del objeto.
    // ¡IMPORTANTE! Debes guardar 'objectPath' en tu base de datos.
    return { uploadUrl, objectPath: objectKey };
  }

  // Descarga un archivo y lo envía como respuesta al cliente (ej: para mostrar una imagen).
  // Reemplaza a tu 'downloadObject' original.
  async downloadObject(objectKey: string, res: Response, cacheTtlSec: number = 3600) {
    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      });

      const response = await s3Client.send(getObjectCommand);
      const stream = response.Body as Readable;

      // Establecer las cabeceras de la respuesta
      res.set({
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": response.ContentLength?.toString(),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      stream.pipe(res);

    } catch (error: any) {
      console.error("Error downloading file:", error);
      if (error.name === 'NoSuchKey') {
         if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      } else {
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      }
    }
  }

  // Obtiene un archivo del storage. Reemplaza a tu 'getObjectEntityFile' original.
  async getObjectEntityFile(objectPath: string): Promise<Readable | undefined> {
    if (!objectPath) {
      throw new ObjectNotFoundError("Object path is empty");
    }

    const exists = await this.fileExists(objectPath);
    if (!exists) {
      throw new ObjectNotFoundError(`Object with path "${objectPath}" not found.`);
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectPath,
    });

    const response = await s3Client.send(command);
    return response.Body as Readable;
  }

  // ¡IMPORTANTE! LAS SIGUIENTES FUNCIONES DE TU CÓDIGO VIEJO YA NO SON NECESARIAS
  // porque el nuevo sistema es más simple. No necesitas buscar en directorios públicos/privados.
  // Cualquier archivo que necesites mostrar, simplemente obtienes su 'objectPath' de la base de datos
  // y lo pasas a 'downloadObject'.
}