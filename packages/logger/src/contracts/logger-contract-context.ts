/**
 * Contexto adicional para un evento de log.
 *
 * Permite adjuntar información útil como módulo, error, identificadores,
 * datos técnicos o cualquier metadata necesaria para diagnóstico.
 */
export interface LoggerContext {
  /**
   * Nombre del módulo que genera el log.
   *
   * Cuando se define, este valor puede usarse como etiqueta principal
   * del mensaje en los formatters.
   *
   * Ejemplos:
   * - Core
   * - Config
   * - Logger
   * - Database
   */
  module?: string;

  /**
   * Error relacionado con el evento de log.
   *
   * Se mantiene como unknown para permitir Error, objetos simples u otros
   * valores capturados durante la ejecución.
   */
  error?: unknown;

  /**
   * Metadata adicional asociada al evento de log.
   *
   * Permite agregar datos técnicos sin cerrar el contrato a una estructura
   * fija, por ejemplo identificadores, rutas, payloads controlados o estados
   * internos.
   */
  [key: string]: unknown;
}
