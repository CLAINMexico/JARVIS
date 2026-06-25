import type {
  LoggerContext
} from './logger-context.js';

import type {
  LoggerLevel
} from './logger-level.js';

/**
 * Representa un evento normalizado de log.
 *
 * Esta estructura es la que reciben formatters y transports
 * para convertir el evento en texto o escribirlo en algún destino.
 */
export interface LoggerEntry {
  /**
   * Nivel del evento.
   */
  level: LoggerLevel;

  /**
   * Mensaje principal del evento.
   */
  message: string;

  /**
   * Fecha y hora exacta en la que se generó el evento.
   */
  timestamp: Date;

  /**
   * Zona horaria usada para representar la fecha del evento.
   */
  timeZone: string;

  /**
   * Módulo responsable del evento.
   */
  module: string;

  /**
   * Contexto adicional opcional.
   */
  context?: LoggerContext;
}
