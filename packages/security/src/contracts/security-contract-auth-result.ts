import type {
  SecurityJwtPayload
} from './security-contract-jwt-payload.js';

/**
 * Resultado normalizado de una autenticación exitosa.
 *
 * Este contrato representa el resultado universal que puede usar cualquier
 * aplicación, sin importar el framework HTTP que esté usando.
 */
export interface SecurityAuthResult {
  /**
   * Token Bearer extraído desde Authorization header.
   */
  token: string;

  /**
   * Payload JWT verificado y validado por @jarvis/security.
   */
  payload: SecurityJwtPayload;
}
