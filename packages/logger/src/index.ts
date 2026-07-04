/**
 * Contratos públicos de @jarvis/logger.
 *
 * Estos types describen el contexto, eventos, niveles, opciones y transports
 * usados por el sistema de logging.
 */
export type {
  LoggerContext
} from './contracts/logger-contract-context.js';

export type {
  LoggerEntry
} from './contracts/logger-contract-entry.js';

export type {
  LoggerLevel
} from './contracts/logger-contract-level.js';

export type {
  LoggerOptions
} from './contracts/logger-contract-options.js';

export type {
  LoggerTransport
} from './contracts/logger-contract-transport.js';

/**
 * Formatters públicos del logger.
 *
 * Estas funciones convierten entradas normalizadas de log en texto para
 * distintos destinos, como consola o archivos.
 */
export {
  formatLoggerConsoleEntry
} from './formatters/logger-formatter-console.js';

export {
  formatLoggerDate
} from './formatters/logger-formatter-date.js';

export {
  formatLoggerFileEntry
} from './formatters/logger-formatter-file.js';

/**
 * Runtime principal de @jarvis/logger.
 *
 * LoggerService crea eventos normalizados y los distribuye hacia los
 * transports configurados.
 */
export type {
  LoggerServiceOptions
} from './runtime/logger-runtime-service.js';

export {
  LoggerService
} from './runtime/logger-runtime-service.js';

/**
 * Módulo vivo de logger compatible con @jarvis/core.
 *
 * createLoggerModule() crea una instancia lista para registrarse dentro
 * del runtime de J.A.R.V.I.S.
 */
export type {
  LoggerModule
} from './runtime/logger-runtime-module.js';

export {
  createLoggerModule
} from './runtime/logger-runtime-module.js';

/**
 * Transports públicos del logger.
 *
 * Los transports representan destinos de escritura, como consola o archivos.
 */
export type {
  LoggerConsoleTransportOptions
} from './transports/logger-transport-console.js';

export {
  LoggerConsoleTransport
} from './transports/logger-transport-console.js';

export type {
  LoggerFileTransportOptions
} from './transports/logger-transport-file.js';

export {
  LoggerFileTransport
} from './transports/logger-transport-file.js';

/**
 * Utilidades públicas para niveles de log.
 *
 * Permiten validar prioridad de niveles y formatearlos para salida visual.
 */
export {
  formatLoggerLevel,
  shouldLog
} from './utils/logger-util-level.js';

/**
 * Utilidades públicas para rutas y nombres de archivos de log.
 *
 * Permiten construir carpetas, nombres de archivo y rutas completas usando
 * fecha, zona horaria y nivel de log.
 */
export {
  getLoggerDirectory,
  getLoggerFileName,
  getLoggerFilePath
} from './utils/logger-util-path.js';

/**
 * Utilidad pública para formatear contexto adicional de logs.
 *
 * Normaliza metadata y errores antes de imprimirlos como JSON legible.
 */
export {
  formatLoggerContext
} from './utils/logger-util-context.js';

/**
 * Información pública del package @jarvis/logger.
 *
 * Este objeto permite identificar el package desde pruebas, diagnósticos
 * o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisLoggerPackage = {
  name: '@jarvis/logger',
  description: 'J.A.R.V.I.S. | Package - Logger'
} as const;
