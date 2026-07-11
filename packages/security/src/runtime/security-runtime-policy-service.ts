import {
  forbidden
} from '@jarvis/http';

import type {
  SecurityAuthorizationOptions
} from '../contracts/security-contract-authorization-options.js';

import type {
  SecurityPolicyOptions
} from '../contracts/security-contract-policy-options.js';

import type {
  SecurityPolicyResult
} from '../contracts/security-contract-policy-result.js';

import {
  SecurityAuthorizationService
} from './security-runtime-authorization-service.js';

/**
 * Servicio universal para evaluar policies de seguridad.
 *
 * Este servicio no define reglas de negocio. Únicamente evalúa policies
 * declarativas definidas por una aplicación, usando roles y permisos
 * presentes en un payload previamente autenticado.
 */
export class SecurityPolicyService {
  private readonly authorization: SecurityAuthorizationService;

  public constructor() {
    this.authorization = new SecurityAuthorizationService();
  }

  /**
   * Evalúa una policy contra un payload autenticado.
   */
  public evaluate(
    options: SecurityPolicyOptions
  ): SecurityPolicyResult {
    const authorizationOptions: SecurityAuthorizationOptions = {
      payload: options.payload
    };

    if (typeof options.policy.requiredRoles !== 'undefined') {
      authorizationOptions.requiredRoles = options.policy.requiredRoles;
    }

    if (typeof options.policy.requiredPermissions !== 'undefined') {
      authorizationOptions.requiredPermissions = options.policy.requiredPermissions;
    }

    if (typeof options.policy.mode !== 'undefined') {
      authorizationOptions.mode = options.policy.mode;
    }

    try {
      const result = this.authorization.authorize(authorizationOptions);

      const policyResult: SecurityPolicyResult = {
        authorized: true,
        policyName: options.policy.name,
        mode: result.mode,
        requiredRoles: result.requiredRoles,
        requiredPermissions: result.requiredPermissions,
        payloadRoles: result.payloadRoles,
        payloadPermissions: result.payloadPermissions
      };

      if (typeof options.policy.description !== 'undefined') {
        policyResult.policyDescription = options.policy.description;
      }

      return policyResult;
    } catch (error: unknown) {
      throw forbidden('Policy no autorizada para esta operación.', {
        package: '@jarvis/security',
        event: 'security.policy.forbidden',
        policyName: options.policy.name,
        policyDescription: options.policy.description,
        requiredRoles: options.policy.requiredRoles ?? [],
        requiredPermissions: options.policy.requiredPermissions ?? [],
        mode: options.policy.mode ?? 'all',
        error
      });
    }
  }
}
