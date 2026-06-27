import {
  join
} from 'node:path';

import type {
  LoggerLevel
} from '../contracts/logger-contract-level.js';

/**
 * Partes de fecha usadas para construir rutas y nombres de archivos de log.
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
 * Se usa para construir carpetas y nombres de archivo con la misma fecha
 * local que aparece en los logs.
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
 * Normaliza el nombre de la aplicación para usarlo en nombres de archivo.
 *
 * Esta función funciona como una segunda línea de defensa. Normalmente
 * appName ya debería llegar normalizado desde @jarvis/bootstrap, pero el
 * transport de archivos vuelve a normalizarlo para evitar nombres inválidos.
 *
 * Ejemplos:
 * - Sandbox-API -> SANDBOX_API
 * - JARVIS_SANDBOXAPI -> JARVIS_SANDBOXAPI
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
 *
 * Ejemplos:
 * - 2026_06_24_JARVIS_SANDBOXAPI_ALL.log
 * - 2026_06_24_JARVIS_SANDBOXAPI_ERROR.log
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
 *
 * Combina el directorio diario con el nombre de archivo correspondiente
 * al nivel recibido.
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
