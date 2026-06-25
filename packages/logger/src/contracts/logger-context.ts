/**
 * Contexto adicional para un evento de log.
 *
 * Permite adjuntar información útil como módulo, archivo,
 * error, identificadores o cualquier dato técnico necesario
 * para diagnóstico.
 */
export interface LoggerContext {
  /**
   * Nombre del módulo que genera el log.
   *
   * Ejemplos:
   * - Core
   * - Config
   * - Logger
   * - Database
   */
  module?: string;

  /**
   * Error relacionado con el evento.
   *
   * Se mantiene como unknown para permitir Error, objetos simples
   * u otros valores capturados durante ejecución.
   */
  error?: unknown;

  /**
   * Permite agregar datos adicionales sin cerrar el contrato.
   */
  [key: string]: unknown;
}
