/**
 * Se exporta como type porque BootstrapOptions solo describe
 * las opciones necesarias para crear el bootstrap inicial de una app.
 */
export type {
  BootstrapOptions
} from './contracts/bootstrap-options.js';

/**
 * Se exporta como type porque BootstrapApp solo describe
 * la estructura normalizada de la aplicación.
 *
 * Esta estructura se usa después para alimentar Jarvis.boot().
 */
export type {
  BootstrapApp
} from './contracts/bootstrap-app.js';

/**
 * Se exporta como type porque BootstrapServer solo describe
 * la estructura normalizada del servidor.
 *
 * Esta estructura se usa después para alimentar Jarvis.boot().
 */
export type {
  BootstrapServer
} from './contracts/bootstrap-server.js';

/**
 * Se exporta como type porque BootstrapLogger solo describe
 * la configuración normalizada necesaria para crear @jarvis/logger.
 */
export type {
  BootstrapLogger
} from './contracts/bootstrap-logger.js';

/**
 * Se exporta como type porque BootstrapResult solo describe
 * el resultado final entregado por @jarvis/bootstrap.
 *
 * Este resultado contiene settings, ConfigService y valores normalizados
 * para que una app pueda construir sus módulos y arrancar @jarvis/core.
 */
export type {
  BootstrapResult
} from './contracts/bootstrap-result.js';

/**
 * Se exporta como utilidad pública porque puede ser útil para normalizar
 * valores simples al construir integraciones o pruebas sobre bootstrap.
 */
export {
  getBootstrapBoolean,
  getBootstrapEnvironment,
  getBootstrapLoggerLevel,
  getBootstrapNumber,
  getBootstrapString
} from './utils/bootstrap-value-utils.js';

/**
 * Se exportan utilidades del logger porque permiten construir nombres
 * consistentes para archivos y módulos de log.
 */
export {
  buildBootstrapLoggerAppName,
  buildBootstrapLoggerDefaultModule
} from './utils/bootstrap-logger-utils.js';

/**
 * Se exporta createJarvisBootstrap como API principal del package.
 *
 * Esta función prepara la configuración inicial de una app antes de
 * arrancar @jarvis/core.
 */
export {
  createJarvisBootstrap
} from './runtime/jarvis-bootstrap.js';

/**
 * Información pública del package @jarvis/bootstrap.
 *
 * Este objeto permite identificar el package desde pruebas,
 * diagnósticos o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisBootstrapPackage = {
  name: '@jarvis/bootstrap',
  description: 'J.A.R.V.I.S. | Package - Bootstrap'
} as const;
