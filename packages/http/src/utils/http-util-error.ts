import {
  HTTP_ERROR_CODE
} from '../contracts/http-contract-error-code.js';

import type {
  HttpErrorDetails
} from '../contracts/http-contract-error-options.js';

import {
  HTTP_STATUS
} from '../contracts/http-contract-status-code.js';

import {
  JarvisHttpError
} from '../runtime/http-runtime-error.js';

/**
 * Crea un error HTTP 400 Bad Request.
 *
 * Este error debe usarse cuando la solicitud no es válida por formato,
 * parámetros faltantes, parámetros inválidos o datos incompatibles con lo
 * esperado por la API.
 */
export function badRequest(
  message = 'La solicitud no es válida.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: HTTP_ERROR_CODE.BAD_REQUEST,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 401 Unauthorized.
 *
 * Este error debe usarse cuando la solicitud requiere autenticación o cuando
 * las credenciales enviadas no son válidas.
 */
export function unauthorized(
  message = 'No autorizado.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    code: HTTP_ERROR_CODE.UNAUTHORIZED,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 403 Forbidden.
 *
 * Este error debe usarse cuando el usuario está autenticado, pero no tiene
 * permisos suficientes para ejecutar la acción solicitada.
 */
export function forbidden(
  message = 'Acceso prohibido.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.FORBIDDEN,
    code: HTTP_ERROR_CODE.FORBIDDEN,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 404 Not Found.
 *
 * Este error debe usarse cuando el recurso solicitado no existe o no está
 * disponible para la solicitud actual.
 */
export function notFound(
  message = 'Recurso no encontrado.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    code: HTTP_ERROR_CODE.NOT_FOUND,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 409 Conflict.
 *
 * Este error debe usarse cuando la operación entra en conflicto con el estado
 * actual de un recurso.
 */
export function conflict(
  message = 'La solicitud entra en conflicto con el estado actual del recurso.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.CONFLICT,
    code: HTTP_ERROR_CODE.CONFLICT,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 422 Unprocessable Entity.
 *
 * Este error debe usarse cuando la solicitud tiene una estructura válida,
 * pero los datos no cumplen con las reglas de validación esperadas.
 */
export function validationError(
  message = 'La información enviada no cumple con las reglas de validación.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    code: HTTP_ERROR_CODE.VALIDATION_ERROR,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 429 Too Many Requests.
 *
 * Este error debe usarse cuando una solicitud excede límites definidos por la
 * aplicación, como rate limits, intentos fallidos o límites operativos.
 */
export function tooManyRequests(
  message = 'Se excedió el límite de solicitudes permitido.',
  details?: HttpErrorDetails
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    code: HTTP_ERROR_CODE.TOO_MANY_REQUESTS,
    message,
    ...(details !== undefined ? { details } : {})
  });
}

/**
 * Crea un error HTTP 500 Internal Server Error.
 *
 * Este error debe usarse para fallos internos inesperados. El mensaje debe ser
 * seguro y no debe exponer detalles técnicos sensibles al cliente.
 */
export function internalServerError(
  message = 'Ocurrió un error interno inesperado.',
  details?: HttpErrorDetails,
  cause?: unknown
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR,
    message,
    ...(details !== undefined ? { details } : {}),
    ...(cause !== undefined ? { cause } : {})
  });
}

/**
 * Crea un error HTTP 503 Service Unavailable.
 *
 * Este error debe usarse cuando un servicio requerido no está disponible
 * temporalmente o cuando la aplicación no puede atender la solicitud.
 */
export function serviceUnavailable(
  message = 'El servicio no está disponible temporalmente.',
  details?: HttpErrorDetails,
  cause?: unknown
): JarvisHttpError {
  return new JarvisHttpError({
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
    code: HTTP_ERROR_CODE.SERVICE_UNAVAILABLE,
    message,
    ...(details !== undefined ? { details } : {}),
    ...(cause !== undefined ? { cause } : {})
  });
}
