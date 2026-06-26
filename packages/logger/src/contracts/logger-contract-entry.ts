import type {
  LoggerContext
} from './logger-contract-context.js';

import type {
  LoggerLevel
} from './logger-contract-level.js';

/**
 * Representa un evento normalizado de log.
 *
 * Esta estructura se construye internamente antes de enviar el evento
 * a formatters y transports.
 *
 * Los formatters usan esta información para convertir el evento en texto,
 * mientras que los transports la usan para escribirlo en algún destino,
 * como consola o archivos.
 */
export interface LoggerEntry {
  /**
   * Nivel del evento de log.
   *
   * Define la prioridad del mensaje y permite filtrar qué eventos deben
   * procesarse según la configuración del logger.
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
   *
   * No modifica el timestamp original, solo define cómo debe formatearse
   * visualmente la fecha en las salidas del logger.
   */
  timeZone: string;

  /**
   * Módulo responsable del evento.
   *
   * Este valor ya debe venir resuelto usando el módulo indicado en el contexto
   * o el módulo por defecto configurado en LoggerService.
   */
  module: string;

  /**
   * Contexto adicional opcional asociado al evento.
   *
   * Puede incluir metadata técnica, errores, identificadores o datos útiles
   * para diagnóstico.
   */
  context?: LoggerContext;
}
