import {
  join
} from 'node:path';

import type {
  LoggerLevel
} from '../contracts/logger-contract-level.js';

/**
 * Partes de fecha usadas para construir rutas de archivos de log.
 */
interface LoggerDateParts {
  year: string;
  month: string;
  day: string;
}

/**
 * Obtiene una parte específica generada por Intl.DateTimeFormat.
 *
 * Intl.DateTimeFormat puede devolver las partes en distinto orden según
 * locale o configuración, por eso se busca cada parte por su type.
 */
function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  const value = parts.find((part) => part.type === type)?.value;

  if (!value) {
    throw new Error(`No se pudo resolver la parte de fecha "${type}" para el logger.`);
  }

  return value;
}

/**
 * Obtiene partes de fecha usando una zona horaria específica.
 *
 * Se usa para construir carpetas de logs con la misma fecha local que aparece
 * en las líneas del logger.
 *
 * El objeto Date original no se modifica. La zona horaria solo se usa para
 * resolver la representación local del año, mes y día.
 */
function getDateParts(date: Date, timeZone: string): LoggerDateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(date);

  return {
    year: getPart(parts, 'year'),
    month: getPart(parts, 'month'),
    day: getPart(parts, 'day')
  };
}

/**
 * Devuelve la ruta de carpeta donde se guardarán los logs.
 *
 * Estructura estándar:
 *
 * logs/YYYY/MM/DD
 *
 * Esta estructura no es configurable porque forma parte del estándar interno
 * de @jarvis/logger.
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
 * Formato estándar:
 *
 * all.log
 * debug.log
 * info.log
 * warn.log
 * error.log
 * fatal.log
 *
 * La fecha y la aplicación no se colocan en el nombre del archivo porque:
 * - La fecha ya vive en la ruta logs/YYYY/MM/DD.
 * - La aplicación ya vive dentro de cada línea del log.
 * - El nivel ya vive dentro de cada línea del log.
 */
export function getLoggerFileName(
  level: LoggerLevel | 'all'
): string {
  return `${level}.log`;
}

/**
 * Devuelve la ruta completa del archivo de log.
 *
 * Combina el directorio diario con el nombre de archivo correspondiente
 * al nivel recibido.
 */
export function getLoggerFilePath(
  basePath: string,
  level: LoggerLevel | 'all',
  date: Date,
  timeZone: string
): string {
  return join(
    getLoggerDirectory(basePath, date, timeZone),
    getLoggerFileName(level)
  );
}
