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
 * Formatea una entrada de log para salida en archivo.
 *
 * Esta función no escribe directamente en disco. Solo convierte un
 * LoggerEntry en texto plano, dejando la escritura real al transport
 * de archivos.
 *
 * No usa colores ANSI ni símbolos visuales para mantener archivos limpios,
 * fáciles de leer, buscar y procesar por herramientas externas.
 */
export function formatLoggerFileEntry(entry: LoggerEntry): string {
  const level = `[${formatLoggerLevel(entry.level)}]`;
  const date = formatLoggerDate(entry.timestamp, entry.timeZone);
  const message = `${level} ${date} | [${entry.module}] ${entry.message}`;
  const context = formatLoggerContext(entry.context);

  if (!context) {
    return message;
  }

  return `${message}\n${context}`;
}
