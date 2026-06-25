import type {
  LoggerEntry
} from '../contracts/logger-entry.js';

import {
  formatLoggerDate
} from './logger-date-formatter.js';

import {
  formatLoggerLevel
} from '../utils/logger-level-utils.js';

import {
  formatLoggerContext
} from '../utils/logger-context-utils.js';

/**
 * Formatea una entrada de log para archivo.
 *
 * No usa colores ni símbolos para mantener archivos limpios,
 * fáciles de leer, buscar y procesar.
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
