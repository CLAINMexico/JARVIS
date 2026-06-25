import {
  join
} from 'node:path';

import type {
  LoggerLevel
} from '../contracts/logger-level.js';

interface LoggerDateParts {
  year: string;
  month: string;
  day: string;
}
/**
 * Obtiene partes de fecha usando una zona horaria específica.
 *
 * Se usa para construir carpetas y nombres de archivo con la misma
 * fecha local que aparece en los logs.
 */
function getDateParts(date: Date, timeZone: string): LoggerDateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('No se pudieron resolver las partes de fecha para el logger.');
  }

  return {
    year,
    month,
    day
  };
}

/**
 * Normaliza el nombre de la aplicación para usarlo en nombres de archivo.
 *
 * Ejemplo:
 * Sandbox API -> SANDBOX_API
 * JARVIS_SANDBOXAPI -> JARVIS_SANDBOXAPI
 */
export function normalizeLoggerAppName(appName: string): string {
  return appName
    .trim()
    .toUpperCase()
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^A-Z0-9_]/g, '');
}

/**
 * Devuelve la ruta de carpeta donde se guardarán los logs.
 *
 * Estructura:
 * logs/YYYY/MM/DD
 */
export function getLoggerDirectory(
  basePath: string,
  date: Date,
  timeZone: string
): string {
  const parts = getDateParts(date, timeZone);

  return join(basePath, parts.year, parts.month, parts.day);
}

/**
 * Devuelve el nombre de archivo para un log.
 *
 * Formato:
 * YYYY_MM_DD_APP_LEVEL.log
 */
export function getLoggerFileName(
  appName: string,
  level: LoggerLevel | 'all',
  date: Date,
  timeZone: string
): string {
  const parts = getDateParts(date, timeZone);
  const normalizedAppName = normalizeLoggerAppName(appName);
  const normalizedLevel = level.toUpperCase();

  return `${parts.year}_${parts.month}_${parts.day}_${normalizedAppName}_${normalizedLevel}.log`;
}

/**
 * Devuelve la ruta completa del archivo de log.
 */
export function getLoggerFilePath(
  basePath: string,
  appName: string,
  level: LoggerLevel | 'all',
  date: Date,
  timeZone: string
): string {
  return join(
    getLoggerDirectory(basePath, date, timeZone),
    getLoggerFileName(appName, level, date, timeZone)
  );
}
