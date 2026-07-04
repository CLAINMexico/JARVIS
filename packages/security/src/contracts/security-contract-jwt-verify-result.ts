import type {
  SecurityJwtPayload
} from './security-contract-jwt-payload.js';

/**
 * Resultado exitoso de verificar un token JWT.
 *
 * Este contrato normaliza la salida del servicio JWT para evitar exponer
 * directamente detalles internos de la librería usada para firmar/verificar.
 */
export interface SecurityJwtVerifyResult {
  /**
   * Payload normalizado del token verificado.
   */
  payload: SecurityJwtPayload;

  /**
   * Fecha Unix de emisión del token, cuando existe.
   */
  issuedAt?: number;

  /**
   * Fecha Unix de expiración del token, cuando existe.
   */
  expiresAt?: number;

  /**
   * Emisor del token, cuando existe.
   */
  issuer?: string;

  /**
   * Audiencia del token, cuando existe.
   */
  audience?: string | string[];
}
