import type {
  SecurityAuthorizationMode
} from './security-contract-authorization-mode.js';

/**
 * Resultado normalizado de evaluación de una policy.
 */
export interface SecurityPolicyResult {
  /**
   * Indica si la policy fue autorizada.
   */
  authorized: true;

  /**
   * Nombre de la policy evaluada.
   */
  policyName: string;

  /**
   * Descripción de la policy evaluada.
   */
  policyDescription?: string;

  /**
   * Modo usado para evaluar roles y permisos.
   */
  mode: SecurityAuthorizationMode;

  /**
   * Roles requeridos por la policy.
   */
  requiredRoles: string[];

  /**
   * Permisos requeridos por la policy.
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
