import type {
  HttpErrorCode
} from './http-contract-error-code.js';

import type {
  HttpStatusCode
} from './http-contract-status-code.js';

/**
 * Detalles adicionales permitidos en un error HTTP.
 *
 * Se define como objeto genérico para permitir información contextual sin
 * obligar a todos los errores a compartir la misma estructura.
 */
export type HttpErrorDetails = Record<string, unknown>;

/**
 * Opciones necesarias para construir un error HTTP controlado.
 *
 * Este contrato centraliza la información mínima que debe tener un error
 * dentro del ecosistema J.A.R.V.I.S.
 */
export interface HttpErrorOptions {
  /**
   * Código de estado HTTP asociado al error.
   */
  statusCode: HttpStatusCode;

  /**
   * Código interno estable para identificar el tipo de error.
   */
  code: HttpErrorCode;

  /**
   * Mensaje seguro y legible que puede devolverse al cliente.
   */
  message: string;

  /**
   * Detalles adicionales del error.
   *
   * Deben usarse con cuidado para evitar exponer información sensible.
   */
  details?: HttpErrorDetails;

  /**
   * Error original o causa interna.
   *
   * Este valor ayuda en diagnóstico, pero no debe exponerse directamente
   * al cliente final.
   */
  cause?: unknown;
}
