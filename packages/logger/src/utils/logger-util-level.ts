import type {
  LoggerLevel
} from '../contracts/logger-contract-level.js';

/**
 * Prioridad numérica de cada nivel de log.
 *
 * Mientras mayor sea el número, más importante es el nivel.
 *
 * Orden:
 * debug < info < warn < error < fatal
 */
const LoggerLevelPriority: Record<LoggerLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50
};

/**
 * Indica si un evento debe ser procesado según el nivel mínimo configurado.
 *
 * Ejemplo:
 * - level: debug, minimumLevel: info -> false
 * - level: error, minimumLevel: info -> true
 */
export function shouldLog(level: LoggerLevel, minimumLevel: LoggerLevel): boolean {
  return LoggerLevelPriority[level] >= LoggerLevelPriority[minimumLevel];
}

/**
 * Convierte un nivel a texto estándar para salida visual.
 *
 * El formato homologado no agrega espacios de relleno para mantener
 * etiquetas limpias:
 *
 * [DEBUG]
 * [INFO]
 * [WARN]
 * [ERROR]
 * [FATAL]
 */
export function formatLoggerLevel(level: LoggerLevel): string {
  return level.toUpperCase();
}
