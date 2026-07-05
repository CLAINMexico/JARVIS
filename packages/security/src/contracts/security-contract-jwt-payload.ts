/**
 * Tipos de token JWT soportados por @jarvis/security.
 *
 * access:
 * - Token de acceso para consumir rutas protegidas.
 *
 * refresh:
 * - Token usado para renovar sesiones o generar nuevos access tokens.
 *
 * service:
 * - Token usado para comunicación interna entre servicios.
 */
export type SecurityJwtTokenType = 'access' | 'refresh' | 'service';

/**
 * Metadata segura permitida dentro de un payload JWT.
 *
 * Se mantiene como objeto controlado para evitar abrir el payload completo
 * mediante [key: string]: unknown.
 */
export type SecurityJwtMetadata = Record<string, unknown>;

/**
 * Payload base para tokens JWT generados por @jarvis/security.
 *
 * Este contrato define la información mínima y controlada que puede viajar
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
   * Tipo de token emitido.
   *
   * Este valor permite que @jarvis/security seleccione reglas apropiadas,
   * como expiración por defecto, según el uso esperado del token.
   */
  tokenType: SecurityJwtTokenType;

  /**
   * Identificador de sesión asociado al token.
   *
   * Será útil para refresh tokens, cierre de sesión, revocación futura o
   * trazabilidad de sesiones.
   */
  sessionId?: string;

  /**
   * Identificador de tenant, empresa o espacio lógico asociado al token.
   *
   * Este campo es opcional y se usará cuando una aplicación requiera separar
   * usuarios o servicios por organización.
   */
  tenantId?: string;

  /**
   * Roles asociados al sujeto.
   *
   * En v0.18.1 este campo solo viaja como metadata dentro del token.
   * La validación formal de roles se implementará en una versión posterior.
   */
  roles?: string[];

  /**
   * Permisos asociados al sujeto.
   *
   * En v0.18.1 este campo solo viaja como metadata dentro del token.
   * La validación formal de permisos se implementará en una versión posterior.
   */
  permissions?: string[];

  /**
   * Metadata adicional segura para el token.
   *
   * Este objeto permite extender el payload sin abrir propiedades arbitrarias
   * en la raíz del token.
   */
  metadata?: SecurityJwtMetadata;
}
