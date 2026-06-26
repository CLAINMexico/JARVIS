/**
 * Niveles soportados por el logger de J.A.R.V.I.S.
 *
 * El nivel define la importancia del evento registrado y permite filtrar
 * qué mensajes deben procesarse según la configuración del logger.
 *
 * Orden de prioridad:
 *
 * debug < info < warn < error < fatal
 */
export type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
