/**
 * Catálogo público de status codes HTTP.
 *
 * HTTP_STATUS permite usar códigos de estado oficiales sin escribir números
 * mágicos dentro de paquetes o aplicaciones.
 */
export {
  HTTP_STATUS
} from './contracts/http-contract-status-code.js';

export type {
  HttpStatusCode
} from './contracts/http-contract-status-code.js';

/**
 * Catálogo público de códigos internos de error HTTP.
 *
 * HTTP_ERROR_CODE permite identificar errores de forma estable en APIs,
 * clientes, logs e integraciones.
 */
export {
  HTTP_ERROR_CODE
} from './contracts/http-contract-error-code.js';

export type {
  HttpErrorCode
} from './contracts/http-contract-error-code.js';

/**
 * Contratos públicos para errores HTTP controlados.
 *
 * Estos types definen la estructura base usada por JarvisHttpError para
 * representar errores seguros y consistentes.
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
 * Runtime principal de errores HTTP.
 *
 * JarvisHttpError permite representar errores controlados, seguros,
 * consistentes y convertibles a respuesta HTTP estándar.
 */
export {
  JarvisHttpError,
  isJarvisHttpError
} from './runtime/http-runtime-error.js';

/**
 * Utilidades públicas para crear errores HTTP comunes.
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
 * Utilidades públicas para crear respuestas HTTP estándar.
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
 * Utilidades públicas para clasificación de status codes.
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

/**
 * Información pública del package @jarvis/http.
 *
 * Este objeto permite identificar el package desde pruebas, diagnósticos
 * o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisHttpPackage = {
  name: '@jarvis/http',
  description: 'J.A.R.V.I.S. | Package - HTTP'
} as const;
