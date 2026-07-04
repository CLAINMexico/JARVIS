/**
 * Contexto adicional para un evento de log.
 *
 * Permite adjuntar información útil como paquete, módulo, evento, status code,
 * error, identificadores, datos técnicos o cualquier metadata necesaria para
 * diagnóstico.
 */
export interface LoggerContext {
  /**
   * Nombre del paquete que genera el log.
   *
   * Este valor se usa como etiqueta principal en el formato homologado
   * de consola y archivo.
   *
   * Ejemplos:
   * - @jarvis/core
   * - @jarvis/bootstrap
   * - @jarvis/config
   * - @jarvis/logger
   * - @jarvis/http
   * - Sandbox API
   */
  package?: string;

  /**
   * Nombre del módulo o área interna que genera el log.
   *
   * Este valor se conserva para diagnóstico adicional, pero ya no debe ser
   * la etiqueta principal visual cuando exista package.
   *
   * Ejemplos:
   * - Core
   * - Config
   * - Logger
   * - HTTP
   * - Security
   */
  module?: string;

  /**
   * Nombre técnico del evento registrado.
   *
   * Permite clasificar eventos sin depender únicamente del mensaje.
   *
   * Ejemplos:
   * - http.server.started
   * - http.response.success
   * - runtime.module.booted
   * - security.token.invalid
   */
  event?: string;

  /**
   * Código de estado HTTP asociado al log.
   *
   * Este valor es opcional porque no todos los logs pertenecen a una operación
   * HTTP. Cuando exista, los formatters pueden imprimirlo como parte del
   * formato homologado.
   */
  statusCode?: number;

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
