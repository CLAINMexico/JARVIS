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
   * Nombre de la aplicación normalizado para impresión visual.
   *
   * Este valor representa el bloque:
   *
   * [J.A.R.V.I.S. | App]
   *
   * dentro del formato homologado.
   */
  appName: string;

  /**
   * Paquete responsable del evento.
   *
   * Este valor se usa como etiqueta principal del origen del log.
   *
   * Ejemplos:
   * - @jarvis/core
   * - @jarvis/bootstrap
   * - @jarvis/http
   * - Sandbox API
   */
  package: string;

  /**
   * Módulo responsable del evento.
   *
   * Este valor ya debe venir resuelto usando el módulo indicado en el contexto
   * o el módulo por defecto configurado en LoggerService.
   *
   * Se conserva para metadata y diagnóstico interno.
   */
  module: string;

  /**
   * Nombre técnico del evento registrado.
   *
   * Este valor es opcional y permite clasificar logs de forma estable.
   */
  event?: string;

  /**
   * Código de estado HTTP asociado al log.
   *
   * Este valor es opcional porque no todos los eventos de log pertenecen a
   * una respuesta HTTP.
   */
  statusCode?: number;

  /**
   * Indica si los errores deben imprimirse completos.
   *
   * Cuando es true, se conserva stack trace en errores.
   * Cuando es false, se imprime una versión segura y resumida.
   */
  verboseError: boolean;

  /**
   * Contexto adicional opcional asociado al evento.
   *
   * Puede incluir metadata técnica, errores, identificadores o datos útiles
   * para diagnóstico.
   */
  context?: LoggerContext;
}
