import {
  forbidden
} from '@jarvis/http';

import type {
  SecurityAuthorizationOptions
} from '../contracts/security-contract-authorization-options.js';

import type {
  SecurityAuthorizationResult
} from '../contracts/security-contract-authorization-result.js';

import {
  matchSecurityAuthorizationValues,
  normalizeSecurityAuthorizationValues
} from '../utils/security-util-authorization.js';

/**
 * Servicio universal de autorización de @jarvis/security.
 *
 * Este servicio no consulta base de datos y no depende de frameworks HTTP.
 * Únicamente evalúa roles y permisos ya presentes en un payload autenticado.
 */
export class SecurityAuthorizationService {
  /**
   * Valida si un payload autenticado cumple con los roles y permisos requeridos.
   */
  authorize(
    options: SecurityAuthorizationOptions
  ): SecurityAuthorizationResult {
    const mode = options.mode ?? 'all';

    const requiredRoles = normalizeSecurityAuthorizationValues(
      options.requiredRoles
    );

    const requiredPermissions = normalizeSecurityAuthorizationValues(
      options.requiredPermissions
    );

    const payloadRoles = normalizeSecurityAuthorizationValues(
      options.payload.roles
    );

    const payloadPermissions = normalizeSecurityAuthorizationValues(
      options.payload.permissions
    );

    const rolesAuthorized = matchSecurityAuthorizationValues(
      payloadRoles,
      requiredRoles,
      mode
    );

    const permissionsAuthorized = matchSecurityAuthorizationValues(
      payloadPermissions,
      requiredPermissions,
      mode
    );

    if (!rolesAuthorized || !permissionsAuthorized) {
      throw forbidden('Roles o permisos insuficientes para esta operación.', {
        package: '@jarvis/security',
        event: 'security.authorization.forbidden',
        mode,
        requiredRoles,
        requiredPermissions,
        payloadRoles,
        payloadPermissions
      });
    }

    return {
      authorized: true,
      mode,
      requiredRoles,
      requiredPermissions,
      payloadRoles,
      payloadPermissions
    };
  }

  /**
   * Valida roles requeridos.
   */
  requireRoles(
    options: Pick<SecurityAuthorizationOptions, 'payload' | 'requiredRoles' | 'mode'>
  ): SecurityAuthorizationResult {
    const authorizationOptions: SecurityAuthorizationOptions = {
      payload: options.payload
    };

    if (typeof options.mode !== 'undefined') {
      authorizationOptions.mode = options.mode;
    }

    if (typeof options.requiredRoles !== 'undefined') {
      authorizationOptions.requiredRoles = options.requiredRoles;
    }

    return this.authorize(authorizationOptions);
  }

  /**
   * Valida permisos requeridos.
   */
  requirePermissions(
    options: Pick<SecurityAuthorizationOptions, 'payload' | 'requiredPermissions' | 'mode'>
  ): SecurityAuthorizationResult {
    const authorizationOptions: SecurityAuthorizationOptions = {
      payload: options.payload
    };

    if (typeof options.mode !== 'undefined') {
      authorizationOptions.mode = options.mode;
    }

    if (typeof options.requiredPermissions !== 'undefined') {
      authorizationOptions.requiredPermissions = options.requiredPermissions;
    }

    return this.authorize(authorizationOptions);
  }
}
