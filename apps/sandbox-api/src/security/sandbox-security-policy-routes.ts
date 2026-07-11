import type {
  FastifyInstance
} from 'fastify';

import {
  createErrorResponse,
  createSuccessResponse
} from '@jarvis/http';

import type {
  LoggerService
} from '@jarvis/logger';

import {
  SecurityPolicyService
} from '@jarvis/security';

import type {
  SecurityAuthService
} from '@jarvis/security';

import {
  createSandboxSecurityAuthPreHandler
} from './sandbox-security-auth-pre-handler.js';

import {
  SandboxAdminRolePolicy,
  SandboxSecurityAdminPolicy,
  SandboxSecurityPermissionPolicy
} from './policies/sandbox-security-policies.js';

/**
 * Opciones para registrar las rutas de policies de Sandbox-API.
 */
export interface RegisterSandboxSecurityPolicyRoutesOptions {
  /**
   * Servicio universal de autenticación Bearer.
   */
  securityAuth: SecurityAuthService;

  /**
   * Logger principal de la aplicación.
   */
  logger: LoggerService;
}

/**
 * Registra rutas protegidas para validar el Policy engine universal.
 *
 * Las policies usadas aquí pertenecen a Sandbox-API. @jarvis/security
 * únicamente evalúa si el payload autenticado cumple con la policy recibida.
 */
export function registerSandboxSecurityPolicyRoutes(
  server: FastifyInstance,
  options: RegisterSandboxSecurityPolicyRoutesOptions
): void {
  const policy = new SecurityPolicyService();

  /**
   * PreHandler de autenticación Bearer.
   */
  const authenticate = createSandboxSecurityAuthPreHandler({
    securityAuth: options.securityAuth,
    logger: options.logger,
    allowedTokenTypes: [
      'access'
    ]
  });

  /**
   * Ruta protegida por policy de rol admin.
   */
  server.get('/security/policies/role', {
    preHandler: async (request, reply) => {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = policy.evaluate({
        payload: request.auth!.payload,
        policy: SandboxAdminRolePolicy
      });

      options.logger.info('Policy autorizada correctamente por rol.', {
        package: '@jarvis/security',
        event: 'security.policy.role.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        policyName: SandboxAdminRolePolicy.name,
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Policy de rol autorizada correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la policy por rol.', {
        package: '@jarvis/security',
        event: 'security.policy.role.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        policyName: SandboxAdminRolePolicy.name,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });

  /**
   * Ruta protegida por policy de permiso.
   */
  server.get('/security/policies/permission', {
    preHandler: async (request, reply) => {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = policy.evaluate({
        payload: request.auth!.payload,
        policy: SandboxSecurityPermissionPolicy
      });

      options.logger.info('Policy autorizada correctamente por permiso.', {
        package: '@jarvis/security',
        event: 'security.policy.permission.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        policyName: SandboxSecurityPermissionPolicy.name,
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Policy de permiso autorizada correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la policy por permiso.', {
        package: '@jarvis/security',
        event: 'security.policy.permission.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        policyName: SandboxSecurityPermissionPolicy.name,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });

  /**
   * Ruta protegida por policy combinada de rol y permiso.
   */
  server.get('/security/policies/admin', {
    preHandler: async (request, reply) => {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = policy.evaluate({
        payload: request.auth!.payload,
        policy: SandboxSecurityAdminPolicy
      });

      options.logger.info('Policy autorizada correctamente por rol y permiso.', {
        package: '@jarvis/security',
        event: 'security.policy.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        policyName: SandboxSecurityAdminPolicy.name,
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Policy autorizada correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la policy.', {
        package: '@jarvis/security',
        event: 'security.policy.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        policyName: SandboxSecurityAdminPolicy.name,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });
}
