import {
  readFile
} from 'node:fs/promises';

import {
  resolve
} from 'node:path';

import type {
  ConfigObject
} from '../contracts/config-contract-value.js';

/**
 * Carga y parsea un archivo JSON de configuración.
 *
 * Esta función recibe la ruta de un archivo settings.json, lo lee desde disco,
 * valida que el contenido sea un objeto JSON válido y devuelve su contenido
 * como ConfigObject.
 *
 * Nota:
 * El archivo debe tener una estructura de objeto en la raíz. No se aceptan
 * arreglos, null ni valores primitivos como configuración principal.
 */
export async function loadConfigFile(file: string): Promise<ConfigObject> {
  const filePath = resolve(file);
  const content = await readFile(filePath, 'utf-8');

  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    throw new Error(`No se pudo parsear el archivo de configuración: ${filePath}`, {
      cause: error
    });
  }

  if (
    typeof parsedContent !== 'object' ||
    parsedContent === null ||
    Array.isArray(parsedContent)
  ) {
    throw new Error(`El archivo de configuración debe contener un objeto JSON válido: ${filePath}`);
  }

  return parsedContent as ConfigObject;
}
