import type {
  SecurityJwtTokenType
} from './security-contract-jwt-payload.js';

import type {
  SecurityJwtService
} from '../runtime/security-runtime-jwt-service.js';

/**
 * Opciones para crear SecurityAuthService.
 */
export interface SecurityAuthServiceOptions {
  /**
   * Servicio JWT usado para verificar tokens.
   */
  jwt: SecurityJwtService;
}

/**
 * Opciones para autenticar una solicitud usando Authorization Bearer.
 */
export interface SecurityAuthBearerOptions {
  /**
   * Valor recibido desde el header Authorization.
   *
   * Se permite undefined porque algunos frameworks devuelven undefined
   * cuando el header no existe.
   */
  authorizationHeader: string | null | undefined;

  /**
   * Tipos de token permitidos para la operación actual.
   */
  allowedTokenTypes?: SecurityJwtTokenType[];
}
