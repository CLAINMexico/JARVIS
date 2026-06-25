import type {
  LoggerLevel
} from '../contracts/logger-level.js';

/**
 * Prioridad numérica de cada nivel de log.
 *
 * Mientras mayor sea el número, más importante es el nivel.
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
 */
export function shouldLog(level: LoggerLevel, minimumLevel: LoggerLevel): boolean {
  return LoggerLevelPriority[level] >= LoggerLevelPriority[minimumLevel];
}

/**
 * Convierte un nivel a texto estándar para salida visual.
 */
export function formatLoggerLevel(level: LoggerLevel): string {
  return level.toUpperCase().padEnd(5, ' ');
}
