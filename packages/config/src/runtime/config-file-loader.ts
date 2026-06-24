/**
 * Se importa readFile desde node:fs/promises para leer archivos
 * de forma asíncrona usando APIs nativas de Node.js.
 */
import {
  readFile
} from 'node:fs/promises';

/**
 * Se importa resolve desde node:path para convertir rutas relativas
 * en rutas absolutas seguras.
 */
import {
  resolve
} from 'node:path';

/**
 * Se importa como type porque solo se usa para describir
 * el objeto de configuración cargado desde archivo.
 */
import type {
  ConfigObject
} from '../contracts/config-value.js';

/**
 * Carga y parsea un archivo JSON de configuración.
 *
 * Esta función recibe la ruta de un archivo settings.json,
 * lo lee desde disco y devuelve su contenido como ConfigObject.
 */
export async function loadConfigFile(file: string): Promise<ConfigObject> {
  const filePath = resolve(file);
  const content = await readFile(filePath, 'utf-8');
  try {
    return JSON.parse(content) as ConfigObject;
  } catch (error) {
    throw new Error(`No se pudo parsear el archivo de configuración: ${filePath}`, {
      cause: error
    });
  }
}
