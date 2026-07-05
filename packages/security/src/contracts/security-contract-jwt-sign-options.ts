/**
 * Opciones específicas para firmar un token JWT.
 *
 * Estas opciones solo permiten sobrescribir la expiración de una firma
 * concreta. El issuer y audience deben venir desde SecurityJwtOptions para
 * evitar tokens con origen o destino inconsistentes.
 */
export interface SecurityJwtSignOptions {
  /**
   * Tiempo de expiración específico para el token.
   *
   * Si no se define, @jarvis/security usa la expiración por defecto según
   * payload.tokenType:
   *
   * - access  -> accessTokenExpiresIn
   * - refresh -> refreshTokenExpiresIn
   * - service -> serviceTokenExpiresIn
   */
  expiresIn?: string;
}
