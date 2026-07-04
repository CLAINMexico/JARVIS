import type {
  HttpStatusCode
} from './http-contract-status-code.js';

/**
 * Metadata adicional permitida en una respuesta HTTP exitosa.
 *
 * Puede usarse para paginación, trazabilidad, conteos, filtros aplicados
 * u otra información contextual segura para el cliente.
 */
export type HttpSuccessMeta = Record<string, unknown>;

/**
 * Respuesta HTTP estandarizada para operaciones exitosas.
 *
 * Esta estructura permite que todas las APIs construidas sobre J.A.R.V.I.S.
 * respondan de forma consistente cuando una operación termina correctamente.
 */
export interface HttpSuccessResponse<TData = unknown> {
  /**
   * Indica que la operación fue exitosa.
   */
  success: true;

  /**
   * Código de estado HTTP asociado a la respuesta.
   *
   * Normalmente será 200, 201 o 204 dependiendo de la operación.
   */
  statusCode: HttpStatusCode;

  /**
   * Mensaje legible de la operación.
   *
   * Debe ser corto, claro y seguro para el cliente.
   */
  message: string;

  /**
   * Datos devueltos por la operación.
   *
   * El tipo puede definirse desde quien consume el contrato.
   */
  data?: TData;

  /**
   * Metadata adicional de la respuesta.
   *
   * Debe usarse para información contextual que no pertenezca directamente
   * al cuerpo principal de datos.
   */
  meta?: HttpSuccessMeta;
}
