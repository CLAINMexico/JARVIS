import type {
  LoggerEntry
} from '../contracts/logger-contract-entry.js';

import type {
  LoggerLevel
} from '../contracts/logger-contract-level.js';

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
 * Colores ANSI básicos para salida en consola.
 *
 * Estos códigos se aplican según el nivel del log y permiten distinguir
 * visualmente eventos debug, informativos, advertencias, errores y eventos
 * fatales dentro de terminales compatibles.
 */
const LoggerLevelColors: Record<LoggerLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  fatal: '\x1b[41m'
};

/**
 * Código ANSI usado para restaurar el color original de la consola.
 */
const ResetColor = '\x1b[0m';

/**
 * Formatea una entrada de log para salida en consola.
 *
 * Esta función no escribe directamente en consola. Solo convierte un
 * LoggerEntry en texto, dejando la escritura real al transport de consola.
 *
 * Cuando colors está habilitado, el color se aplica a toda la salida,
 * incluyendo el mensaje principal y el contexto adicional.
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
