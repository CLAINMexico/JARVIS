/**
 * Contratos públicos de @jarvis/bootstrap.
 *
 * Estos types describen las opciones de entrada, estructuras normalizadas
 * y resultado final que produce el bootstrap inicial de una aplicación.
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
 * Utilidades públicas para normalizar valores simples durante el bootstrap.
 *
 * Pueden usarse en pruebas, integraciones o futuras extensiones que necesiten
 * convertir valores desconocidos a tipos seguros.
 */
export {
  getBootstrapBoolean,
  getBootstrapEnvironment,
  getBootstrapLoggerLevel,
  getBootstrapNumber,
  getBootstrapString
} from './utils/bootstrap-util-value.js';

/**
 * Utilidades públicas para construir nombres consistentes relacionados
 * con @jarvis/logger.
 */
export {
  buildBootstrapLoggerAppName,
  buildBootstrapLoggerDefaultModule
} from './utils/bootstrap-util-logger.js';

/**
 * API principal de @jarvis/bootstrap.
 *
 * createJarvisBootstrap() prepara la configuración inicial de una aplicación
 * antes de arrancar @jarvis/core.
 */
export {
  createJarvisBootstrap
} from './runtime/bootstrap-runtime-module.js';

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
