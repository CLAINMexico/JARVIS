import type {
  LoggerEntry
} from '../contracts/logger-entry.js';

import type {
  LoggerLevel
} from '../contracts/logger-level.js';

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
 * Colores ANSI básicos para salida en consola.
 *
 * Se usan códigos estándar para mantener compatibilidad
 * entre terminales comunes.
 */
const LoggerLevelColors: Record<LoggerLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  fatal: '\x1b[41m'
};

/**
 * Código ANSI para resetear color.
 */
const ResetColor = '\x1b[0m';

/**
 * Formatea una entrada de log para consola.
 */
export function formatLoggerConsoleEntry(entry: LoggerEntry, colors: boolean): string {
  const level = `[${formatLoggerLevel(entry.level)}]`;
  const date = formatLoggerDate(entry.timestamp, entry.timeZone);
  const message = `${level} ${date} | [${entry.module}] ${entry.message}`;
  const context = formatLoggerContext(entry.context);
  const output = context ? `${message}\n${context}` : message;

  if (!colors) {
    return output;
  }

  return `${LoggerLevelColors[entry.level]}${output}${ResetColor}`;
}
