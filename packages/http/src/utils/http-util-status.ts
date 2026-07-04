import type {
  HttpStatusCode
} from '../contracts/http-contract-status-code.js';

/**
 * Valida si un código HTTP pertenece al rango informativo.
 *
 * Rango:
 * 100 - 199
 */
export function isInformationalStatus(statusCode: number): boolean {
  return statusCode >= 100 && statusCode <= 199;
}

/**
 * Valida si un código HTTP pertenece al rango de éxito.
 *
 * Rango:
 * 200 - 299
 */
export function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode <= 299;
}

/**
 * Valida si un código HTTP pertenece al rango de redirección.
 *
 * Rango:
 * 300 - 399
 */
export function isRedirectStatus(statusCode: number): boolean {
  return statusCode >= 300 && statusCode <= 399;
}

/**
 * Valida si un código HTTP pertenece al rango de error del cliente.
 *
 * Rango:
 * 400 - 499
 */
export function isClientErrorStatus(statusCode: number): boolean {
  return statusCode >= 400 && statusCode <= 499;
}

/**
 * Valida si un código HTTP pertenece al rango de error del servidor.
 *
 * Rango:
 * 500 - 599
 */
export function isServerErrorStatus(statusCode: number): boolean {
  return statusCode >= 500 && statusCode <= 599;
}

/**
 * Valida si un código HTTP pertenece a cualquier rango de error.
 *
 * Incluye:
 * - Errores del cliente: 400 - 499
 * - Errores del servidor: 500 - 599
 */
export function isErrorStatus(statusCode: number): boolean {
  return isClientErrorStatus(statusCode) || isServerErrorStatus(statusCode);
}

/**
 * Valida si un código HTTP pertenece al rango válido estándar.
 *
 * Rango:
 * 100 - 599
 */
export function isHttpStatus(statusCode: number): boolean {
  return statusCode >= 100 && statusCode <= 599;
}

/**
 * Valida si un código HTTP pertenece a los códigos soportados directamente
 * por los contratos de @jarvis/http.
 *
 * Esta función es útil cuando se desea confirmar que un valor numérico forma
 * parte del catálogo oficial usado por J.A.R.V.I.S.
 */
export function isSupportedHttpStatus(
  statusCode: number,
  supportedStatuses: readonly HttpStatusCode[]
): statusCode is HttpStatusCode {
  return supportedStatuses.includes(statusCode as HttpStatusCode);
}
