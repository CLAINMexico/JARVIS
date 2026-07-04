/**
 * Contratos públicos de códigos de estado HTTP.
 *
 * Estos exports permiten usar el catálogo oficial de status codes soportados
 * por J.A.R.V.I.S. sin escribir números mágicos en otros paquetes.
 */
export {
  HTTP_STATUS
} from './contracts/http-contract-status-code.js';

export type {
  HttpStatusCode
} from './contracts/http-contract-status-code.js';

/**
 * Contratos públicos de códigos internos de error HTTP.
 *
 * Estos códigos permiten identificar errores de forma estable en APIs,
 * clientes, logs e integraciones.
 */
export {
  HTTP_ERROR_CODE
} from './contracts/http-contract-error-code.js';

export type {
  HttpErrorCode
} from './contracts/http-contract-error-code.js';

/**
 * Contratos públicos para construir errores HTTP controlados.
 *
 * Estos types definen la estructura base que usa JarvisHttpError.
 */
export type {
  HttpErrorDetails,
  HttpErrorOptions
} from './contracts/http-contract-error-options.js';

/**
 * Contratos públicos para respuestas HTTP de error.
 *
 * Estos types definen el formato estándar de error que pueden devolver
 * las APIs construidas sobre J.A.R.V.I.S.
 */
export type {
  HttpErrorResponse,
  HttpErrorResponseBody
} from './contracts/http-contract-error-response.js';

/**
 * Contratos públicos para respuestas HTTP exitosas.
 *
 * Estos types definen el formato estándar de éxito que pueden devolver
 * las APIs construidas sobre J.A.R.V.I.S.
 */
export type {
  HttpSuccessMeta,
  HttpSuccessResponse
} from './contracts/http-contract-success-response.js';

/**
 * Clase principal de error HTTP controlado.
 *
 * JarvisHttpError permite representar errores seguros, consistentes y
 * convertibles a respuesta HTTP estándar.
 */
export {
  JarvisHttpError,
  isJarvisHttpError
} from './runtime/http-runtime-error.js';

/**
 * Utilidades para crear errores HTTP comunes.
 *
 * Estos helpers evitan repetir manualmente statusCode, code y message cada
 * vez que otro paquete necesita generar un error controlado.
 */
export {
  badRequest,
  conflict,
  forbidden,
  internalServerError,
  notFound,
  serviceUnavailable,
  tooManyRequests,
  unauthorized,
  validationError
} from './utils/http-util-error.js';

/**
 * Utilidades para crear respuestas HTTP estándar.
 *
 * Estas funciones permiten construir respuestas de éxito y error con el
 * formato oficial de J.A.R.V.I.S.
 */
export {
  createErrorResponse,
  createSuccessResponse
} from './utils/http-util-response.js';

export type {
  CreateFallbackErrorResponseOptions,
  CreateSuccessResponseOptions
} from './utils/http-util-response.js';

/**
 * Utilidades para clasificar códigos de estado HTTP.
 *
 * Estas funciones permiten identificar si un status code pertenece a un rango
 * informativo, exitoso, redirección, error de cliente o error de servidor.
 */
export {
  isClientErrorStatus,
  isErrorStatus,
  isHttpStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isSuccessStatus,
  isSupportedHttpStatus
} from './utils/http-util-status.js';
