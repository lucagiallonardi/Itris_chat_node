import { readFile, writeFile } from "fs/promises";

/**
 * Lee un archivo JSON y lo parsea a un objeto
 * @param path Ruta del archivo JSON
 * @returns Objeto parseado o null si no existe o hay error
 */
export async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const data = await readFile(path, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(`No se pudo leer o parsear el archivo ${path}:`, error);
    return null;
  }
}

/**
 * Guarda un objeto en un archivo JSON
 * @param path Ruta donde guardar el archivo
 * @param data Objeto a guardar
 */
export async function writeJsonFile(path: string, data: unknown): Promise<void> {
  try {
    const json = JSON.stringify(data, null, 2);
    await writeFile(path, json, "utf-8");
  } catch (error) {
    console.error(`Error guardando archivo JSON ${path}:`, error);
  }
}
