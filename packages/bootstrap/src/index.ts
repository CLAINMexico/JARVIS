/**
 * Contratos públicos de aplicación.
 *
 * Estos types describen las opciones de entrada, estructuras normalizadas
 * y resultado final producido durante el bootstrap inicial de una aplicación.
 */
export type {
  BootstrapOptions
} from './contracts/bootstrap-contract-options.js';

export type {
  BootstrapApp
} from './contracts/bootstrap-contract-app.js';

export type {
  BootstrapServer
} from './contracts/bootstrap-contract-server.js';

export type {
  BootstrapLogger
} from './contracts/bootstrap-contract-logger.js';

export type {
  BootstrapResult
} from './contracts/bootstrap-contract-result.js';

/**
 * Runtime principal de Bootstrap.
 *
 * createJarvisBootstrap() prepara la configuración inicial de una aplicación
 * antes de arrancar @jarvis/core.
 */
export {
  createJarvisBootstrap
} from './runtime/bootstrap-runtime-module.js';

/**
 * Utilidades públicas para normalización de valores.
 *
 * Estas funciones permiten convertir valores desconocidos de configuración
 * a tipos seguros usados por el bootstrap.
 */
export {
  getBootstrapBoolean,
  getBootstrapEnvironment,
  getBootstrapLoggerLevel,
  getBootstrapNumber,
  getBootstrapString
} from './utils/bootstrap-util-value.js';

/**
 * Utilidades públicas para integración con Logger.
 *
 * Estas funciones construyen nombres consistentes para la salida visual
 * de @jarvis/logger dentro del ecosistema J.A.R.V.I.S.
 */
export {
  buildBootstrapLoggerAppName,
  buildBootstrapLoggerDefaultModule
} from './utils/bootstrap-util-logger.js';

/**
 * Información pública del package @jarvis/bootstrap.
 *
 * Este objeto permite identificar el package desde pruebas, diagnósticos
 * o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisBootstrapPackage = {
  name: '@jarvis/bootstrap',
  description: 'J.A.R.V.I.S. | Package - Bootstrap'
} as const;
