import type {
  SecurityAuthorizationMode
} from './security-contract-authorization-mode.js';

/**
 * Define una regla reutilizable de autorización.
 *
 * La policy no representa lógica de negocio ejecutable dentro de
 * @jarvis/security. Representa una regla declarativa que una aplicación
 * define y que @jarvis/security puede evaluar de forma universal.
 */
export interface SecurityPolicy {
  /**
   * Nombre único de la policy.
   *
   * Ejemplos:
   *
   * users.read
   * sandbox.admin
   * invoices.cancel
   */
  name: string;

  /**
   * Descripción opcional de la regla.
   */
  description?: string;

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
