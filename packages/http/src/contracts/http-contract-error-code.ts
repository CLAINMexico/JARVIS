/**
 * Catálogo oficial de códigos internos de error HTTP usados por J.A.R.V.I.S.
 *
 * Estos códigos permiten que APIs, clientes, logs y paquetes internos
 * identifiquen errores de forma estable sin depender únicamente del mensaje.
 */
export const HTTP_ERROR_CODE = {
  /**
   * Error genérico para solicitudes inválidas.
   */
  BAD_REQUEST: 'BAD_REQUEST',

  /**
   * Error usado cuando falta autenticación o las credenciales/token no son
   * válidos.
   */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /**
   * Error usado cuando el usuario autenticado no tiene permisos suficientes.
   */
  FORBIDDEN: 'FORBIDDEN',

  /**
   * Error usado cuando un recurso solicitado no existe.
   */
  NOT_FOUND: 'NOT_FOUND',

  /**
   * Error usado cuando la operación entra en conflicto con el estado actual.
   */
  CONFLICT: 'CONFLICT',

  /**
   * Error usado cuando los datos enviados no cumplen las reglas esperadas.
   */
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  /**
   * Error usado cuando se excede un límite de solicitudes.
   */
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  /**
   * Error genérico para fallos internos no controlados.
   */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  /**
   * Error usado cuando un servicio requerido no está disponible.
   */
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;

/**
 * Tipo derivado con los códigos internos de error soportados por J.A.R.V.I.S.
 */
export type HttpErrorCode = typeof HTTP_ERROR_CODE[keyof typeof HTTP_ERROR_CODE];
