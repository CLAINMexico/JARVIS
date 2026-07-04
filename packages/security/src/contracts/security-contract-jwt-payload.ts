/**
 * Payload base para tokens JWT generados por @jarvis/security.
 *
 * Este contrato define la información mínima y extendible que puede viajar
 * dentro de un token firmado por J.A.R.V.I.S.
 *
 * No se deben incluir secretos, contraseñas, tokens externos ni información
 * sensible dentro del payload.
 */
export interface SecurityJwtPayload {
  /**
   * Identificador principal del sujeto dueño del token.
   *
   * Normalmente representa un usuario, servicio o cliente interno.
   *
   * Ejemplos:
   * - user-001
   * - service-sandbox-api
   */
  subject: string;

  /**
   * Roles asociados al sujeto.
   *
   * En v0.18.0 este campo solo viaja como metadata dentro del token.
   * La validación formal de roles se implementará en una versión posterior.
   */
  roles?: string[];

  /**
   * Permisos asociados al sujeto.
   *
   * En v0.18.0 este campo solo viaja como metadata dentro del token.
   * La validación formal de permisos se implementará en una versión posterior.
   */
  permissions?: string[];

  /**
   * Metadata adicional segura para el token.
   *
   * Permite extender el payload sin cerrar el contrato a una estructura fija.
   */
  [key: string]: unknown;
}
