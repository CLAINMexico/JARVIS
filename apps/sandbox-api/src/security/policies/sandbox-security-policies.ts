import type {
  SecurityPolicy
} from '@jarvis/security';

/**
 * Policy de ejemplo para validar acceso por rol admin.
 *
 * Esta policy pertenece a Sandbox-API, no a @jarvis/security.
 * @jarvis/security únicamente evalúa si el payload cumple con esta regla.
 */
export const SandboxAdminRolePolicy = {
  name: 'sandbox.security.admin.role',
  description: 'Permite validar acceso usando el rol admin.',
  requiredRoles: [
    'admin'
  ],
  mode: 'all'
} satisfies SecurityPolicy;

/**
 * Policy de ejemplo para validar acceso por permiso.
 *
 * Esta policy requiere el permiso security.auth.test.
 */
export const SandboxSecurityPermissionPolicy = {
  name: 'sandbox.security.permission',
  description: 'Permite validar acceso usando el permiso security.auth.test.',
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
} satisfies SecurityPolicy;

/**
 * Policy de ejemplo para validar acceso combinando rol y permiso.
 *
 * Esta policy requiere:
 *
 * - Rol: admin
 * - Permiso: security.auth.test
 */
export const SandboxSecurityAdminPolicy = {
  name: 'sandbox.security.admin',
  description: 'Permite validar acceso usando rol admin y permiso security.auth.test.',
  requiredRoles: [
    'admin'
  ],
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
} satisfies SecurityPolicy;
