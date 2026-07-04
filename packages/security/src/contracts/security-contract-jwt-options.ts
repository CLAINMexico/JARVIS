/**
 * Opciones base para crear el servicio JWT de @jarvis/security.
 *
 * Estas opciones controlan cómo se firman y verifican tokens dentro del
 * ecosistema J.A.R.V.I.S.
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
   * Ejemplo:
   * J.A.R.V.I.S.
   */
  issuer?: string;

  /**
   * Audiencia esperada del token.
   *
   * Ejemplo:
   * Sandbox-API
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
}
