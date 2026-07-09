import type {
  SecurityAuthorizationMode
} from './security-contract-authorization-mode.js';

/**
 * Resultado normalizado de autorización.
 */
export interface SecurityAuthorizationResult {
  /**
   * Indica si la operación fue autorizada.
   */
  authorized: true;

  /**
   * Modo usado para evaluar roles y permisos.
   */
  mode: SecurityAuthorizationMode;

  /**
   * Roles requeridos para la operación.
   */
  requiredRoles: string[];

  /**
   * Permisos requeridos para la operación.
   */
  requiredPermissions: string[];

  /**
   * Roles presentes en el payload autenticado.
   */
  payloadRoles: string[];

  /**
   * Permisos presentes en el payload autenticado.
   */
  payloadPermissions: string[];
}
