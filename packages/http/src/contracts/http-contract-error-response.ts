import type {
  HttpErrorCode
} from './http-contract-error-code.js';

import type {
  HttpErrorDetails
} from './http-contract-error-options.js';

import type {
  HttpStatusCode
} from './http-contract-status-code.js';

/**
 * Estructura interna del error dentro de una respuesta HTTP fallida.
 *
 * Esta estructura representa la información segura que puede devolverse al
 * cliente cuando ocurre un error controlado.
 */
export interface HttpErrorResponseBody {
  /**
   * Código interno estable del error.
   *
   * Este valor permite que clientes, frontends o integraciones puedan tomar
   * decisiones sin depender del texto del mensaje.
   */
  code: HttpErrorCode;

  /**
   * Mensaje seguro y legible del error.
   *
   * Debe explicar el problema sin exponer información sensible del servidor.
   */
  message: string;

  /**
   * Detalles adicionales del error.
   *
   * Esta propiedad solo debe incluir información segura para el cliente.
   */
  details?: HttpErrorDetails;
}

/**
 * Respuesta HTTP estandarizada para errores.
 *
 * Esta estructura permite que todas las APIs construidas sobre J.A.R.V.I.S.
 * respondan errores con el mismo formato.
 */
export interface HttpErrorResponse {
  /**
   * Indica que la operación no fue exitosa.
   */
  success: false;

  /**
   * Código de estado HTTP asociado al error.
   */
  statusCode: HttpStatusCode;

  /**
   * Información segura del error.
   */
  error: HttpErrorResponseBody;
}
