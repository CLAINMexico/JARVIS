/**
 * Opciones específicas para firmar un token JWT.
 *
 * Estas opciones pueden sobrescribir valores definidos en
 * SecurityJwtOptions para una firma concreta.
 */
export interface SecurityJwtSignOptions {
  /**
   * Emisor específico para el token.
   */
  issuer?: string;

  /**
   * Audiencia específica para el token.
   */
  audience?: string;

  /**
   * Tiempo de expiración específico para el token.
   *
   * Si no se define, se usa accessTokenExpiresIn desde SecurityJwtOptions.
   */
  expiresIn?: string;
}
