import type {
  SecurityJwtPayload
} from './security-contract-jwt-payload.js';

import type {
  SecurityAuthorizationMode
} from './security-contract-authorization-mode.js';

/**
 * Opciones para validar autorización sobre un payload JWT.
 */
export interface SecurityAuthorizationOptions {
  /**
   * Payload JWT previamente autenticado.
   */
  payload: SecurityJwtPayload;

  /**
   * Roles requeridos para autorizar la operación.
   */
  requiredRoles?: string[];

  /**
   * Permisos requeridos para autorizar la operación.
   */
  requiredPermissions?: string[];

  /**
   * Modo de evaluación.
   *
   * all = todos los roles/permisos requeridos deben existir.
   * any = al menos uno de los roles/permisos requeridos debe existir.
   */
  mode?: SecurityAuthorizationMode;
}
