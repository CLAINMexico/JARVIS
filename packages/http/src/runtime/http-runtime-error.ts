import type {
  HttpErrorResponse
} from '../contracts/http-contract-error-response.js';

import type {
  HttpErrorDetails,
  HttpErrorOptions
} from '../contracts/http-contract-error-options.js';

import type {
  HttpErrorCode
} from '../contracts/http-contract-error-code.js';

import type {
  HttpStatusCode
} from '../contracts/http-contract-status-code.js';

/**
 * Error HTTP controlado del ecosistema J.A.R.V.I.S.
 *
 * Esta clase representa errores que pueden convertirse en respuestas HTTP
 * seguras y consistentes para el cliente.
 *
 * Importante:
 * La propiedad cause puede conservar el error original para diagnóstico,
 * pero no se expone dentro de toResponse() para evitar filtrar información
 * sensible del servidor.
 */
export class JarvisHttpError extends Error {
  /**
   * Código de estado HTTP asociado al error.
   */
  public readonly statusCode: HttpStatusCode;

  /**
   * Código interno estable del error.
   */
  public readonly code: HttpErrorCode;

  /**
   * Detalles adicionales seguros para el cliente.
   */
  public readonly details?: HttpErrorDetails;

  /**
   * Causa interna original del error.
   *
   * Este valor puede usarse para diagnóstico interno, pero no debe exponerse
   * directamente en respuestas HTTP.
   */
  public readonly cause?: unknown;

  /**
   * Crea una nueva instancia de JarvisHttpError.
   *
   * @param options Opciones normalizadas del error HTTP.
   */
  public constructor(options: HttpErrorOptions) {
    super(options.message);

    this.name = 'JarvisHttpError';
    this.statusCode = options.statusCode;
    this.code = options.code;

    if (options.details !== undefined) {
      this.details = options.details;
    }

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }

  /**
   * Convierte el error en una respuesta HTTP segura.
   *
   * Esta respuesta puede enviarse al cliente sin exponer información interna
   * como stack traces, errores originales o detalles sensibles del servidor.
   */
  public toResponse(): HttpErrorResponse {
    return {
      success: false,
      statusCode: this.statusCode,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details !== undefined ? { details: this.details } : {})
      }
    };
  }

  /**
   * Convierte el error en JSON seguro.
   *
   * Se delega a toResponse() para mantener un único formato público.
   */
  public toJSON(): HttpErrorResponse {
    return this.toResponse();
  }
}

/**
 * Valida si un valor desconocido es una instancia de JarvisHttpError.
 *
 * Este type guard permite diferenciar errores HTTP controlados de errores
 * internos inesperados.
 */
export function isJarvisHttpError(error: unknown): error is JarvisHttpError {
  return error instanceof JarvisHttpError;
}
