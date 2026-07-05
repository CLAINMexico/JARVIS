/**
 * Opciones base para crear el servicio JWT de @jarvis/security.
 *
 * Estas opciones controlan cómo se firman y verifican tokens dentro del
 * ecosistema J.A.R.V.I.S.
 *
 * En integraciones oficiales:
 * - issuer debe resolverse internamente como J.A.R.V.I.S.
 * - audience debe resolverse desde app.name.
 */
export interface SecurityJwtOptions {
  /**
   * Secreto usado para firmar y verificar tokens JWT.
   *
   * Debe venir desde configuración segura o variables de entorno.
   * No debe escribirse directamente en código productivo.
   */
  secret: string;

  /**
   * Emisor esperado del token.
   *
   * En J.A.R.V.I.S. debe usarse internamente como:
   * J.A.R.V.I.S.
   */
  issuer?: string;

  /**
   * Audiencia esperada del token.
   *
   * En J.A.R.V.I.S. debe resolverse desde el nombre de la aplicación:
   * app.name.
   */
  audience?: string;

  /**
   * Tiempo de expiración por defecto para tokens de acceso.
   *
   * Formatos comunes:
   * - 15m
   * - 1h
   * - 7d
   */
  accessTokenExpiresIn?: string;

  /**
   * Tiempo de expiración por defecto para refresh tokens.
   *
   * Formatos comunes:
   * - 7d
   * - 15d
   * - 30d
   */
  refreshTokenExpiresIn?: string;

  /**
   * Tiempo de expiración por defecto para tokens de servicio.
   *
   * Formatos comunes:
   * - 1h
   * - 12h
   * - 1d
   */
  serviceTokenExpiresIn?: string;
}
