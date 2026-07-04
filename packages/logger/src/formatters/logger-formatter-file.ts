import type {
  LoggerEntry
} from '../contracts/logger-contract-entry.js';

import {
  formatLoggerDate
} from './logger-formatter-date.js';

import {
  formatLoggerLevel
} from '../utils/logger-util-level.js';

import {
  formatLoggerContext
} from '../utils/logger-util-context.js';

/**
 * Construye el segmento de status code para la salida homologada.
 *
 * El status code solo se imprime cuando existe, ya que no todos los eventos
 * de log pertenecen a una operación HTTP.
 */
function formatLoggerStatusCode(entry: LoggerEntry): string {
  if (entry.statusCode === undefined) {
    return '';
  }

  return ` | [${entry.statusCode}]`;
}

/**
 * Formatea una entrada de log para salida en archivo.
 *
 * Esta función no escribe directamente en disco. Solo convierte un
 * LoggerEntry en texto plano, dejando la escritura real al transport
 * de archivos.
 *
 * No usa colores ANSI ni símbolos visuales para mantener archivos limpios,
 * fáciles de leer, buscar y procesar por herramientas externas.
 *
 * Formato homologado:
 *
 * [YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] | [STATUSCODE] - MESSAGE
 *
 * Cuando no existe statusCode, se omite el bloque:
 *
 * | [STATUSCODE]
 */
export function formatLoggerFileEntry(entry: LoggerEntry): string {
  const date = formatLoggerDate(
    entry.timestamp,
    entry.timeZone
  );

  const level = formatLoggerLevel(
    entry.level
  );

  const statusCode = formatLoggerStatusCode(
    entry
  );

  const message = `[${date}] [${level}] [${entry.package}] [${entry.appName}]${statusCode} - ${entry.message}`;

  const context = formatLoggerContext(
    entry.context
  );

  if (!context) {
    return message;
  }

  return `${message}\n${context}`;
}
