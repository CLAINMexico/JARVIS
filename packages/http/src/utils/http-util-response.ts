import type {
  HttpErrorResponse
} from '../contracts/http-contract-error-response.js';

import type {
  HttpErrorDetails
} from '../contracts/http-contract-error-options.js';

import type {
  HttpSuccessMeta,
  HttpSuccessResponse
} from '../contracts/http-contract-success-response.js';

import {
  HTTP_ERROR_CODE
} from '../contracts/http-contract-error-code.js';

import {
  HTTP_STATUS
} from '../contracts/http-contract-status-code.js';

import type {
  HttpStatusCode
} from '../contracts/http-contract-status-code.js';

import {
  isJarvisHttpError
} from '../runtime/http-runtime-error.js';

/**
 * Opciones permitidas para construir una respuesta HTTP exitosa.
 */
export interface CreateSuccessResponseOptions<TData = unknown> {
  /**
   * Código de estado HTTP de la respuesta.
   *
   * Si no se define, se usa 200 por defecto.
   */
  statusCode?: HttpStatusCode;

  /**
   * Mensaje legible de la operación.
   *
   * Si no se define, se usa un mensaje genérico de operación exitosa.
   */
  message?: string;

  /**
   * Datos devueltos por la operación.
   *
   * La propiedad solo se agrega a la respuesta cuando tiene valor real.
   */
  data?: TData;

  /**
   * Metadata adicional de la respuesta.
   *
   * Puede usarse para paginación, conteos, filtros aplicados o trazabilidad.
   */
  meta?: HttpSuccessMeta;
}

/**
 * Opciones permitidas para construir una respuesta HTTP de error genérica.
 *
 * Se usa principalmente cuando el error recibido no es una instancia de
 * JarvisHttpError.
 */
export interface CreateFallbackErrorResponseOptions {
  /**
   * Mensaje seguro que se devolverá cuando el error no sea controlado.
   */
  message?: string;

  /**
   * Detalles adicionales seguros para el cliente.
   *
   * No debe incluir stack traces ni información interna sensible.
   */
  details?: HttpErrorDetails;
}

/**
 * Crea una respuesta HTTP exitosa con formato estándar de J.A.R.V.I.S.
 *
 * Esta función permite que las APIs devuelvan respuestas consistentes sin
 * repetir manualmente la estructura success/statusCode/message/data/meta.
 */
export function createSuccessResponse<TData = unknown>(
  options: CreateSuccessResponseOptions<TData> = {}
): HttpSuccessResponse<TData> {
  return {
    success: true,
    statusCode: options.statusCode ?? HTTP_STATUS.OK,
    message: options.message ?? 'Operación exitosa.',
    ...(options.data !== undefined ? { data: options.data } : {}),
    ...(options.meta !== undefined ? { meta: options.meta } : {})
  };
}

/**
 * Crea una respuesta HTTP de error con formato estándar de J.A.R.V.I.S.
 *
 * Si el error recibido es JarvisHttpError, se usa su propia respuesta segura.
 * Si el error no es controlado, se devuelve una respuesta genérica 500 para
 * evitar filtrar información interna del servidor.
 */
export function createErrorResponse(
  error: unknown,
  fallback: CreateFallbackErrorResponseOptions = {}
): HttpErrorResponse {
  if (isJarvisHttpError(error)) {
    return error.toResponse();
  }

  return {
    success: false,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error: {
      code: HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: fallback.message ?? 'Ocurrió un error interno inesperado.',
      ...(fallback.details !== undefined ? { details: fallback.details } : {})
    }
  };
}
