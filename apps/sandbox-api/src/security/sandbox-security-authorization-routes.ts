// sandbox-security-authorization-routes.ts
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
  SecurityAuthorizationService
} from '@jarvis/security';

import type {
  SecurityAuthService
} from '@jarvis/security';

import {
  createSandboxSecurityAuthPreHandler
} from './sandbox-security-auth-pre-handler.js';

/**
 * Opciones para registrar las rutas de autorización de Sandbox-API.
 */
export interface RegisterSandboxSecurityAuthorizationRoutesOptions {
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
 * Registra rutas protegidas para validar autorización por roles y permisos.
 *
 * Estas rutas primero validan autenticación Bearer mediante @jarvis/security
 * y después validan roles/permisos presentes en el payload JWT autenticado.
 */
export function registerSandboxSecurityAuthorizationRoutes(
  server: FastifyInstance,
  options: RegisterSandboxSecurityAuthorizationRoutesOptions
): void {
  const authorization = new SecurityAuthorizationService();

  /**
   * PreHandler de autenticación Bearer.
   *
   * Valida que la solicitud tenga un access token válido antes de ejecutar
   * las reglas de autorización por rol o permiso.
   */
  const authenticate = createSandboxSecurityAuthPreHandler({
    securityAuth: options.securityAuth,
    logger: options.logger,
    allowedTokenTypes: [
      'access'
    ]
  });

  /**
   * Ruta protegida por rol.
   *
   * Valida que el payload autenticado tenga el rol admin.
   */
  server.get('/security/authorization/role', {
    preHandler: async function (request, reply) {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = authorization.requireRoles({
        payload: request.auth!.payload,
        requiredRoles: [
          'admin'
        ],
        mode: 'all'
      });

      options.logger.info('Solicitud autorizada correctamente por rol.', {
        package: '@jarvis/security',
        event: 'security.authorization.role.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        requiredRoles: [
          'admin'
        ],
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Rol autorizado correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la solicitud por rol.', {
        package: '@jarvis/security',
        event: 'security.authorization.role.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });

  /**
   * Ruta protegida por permiso.
   *
   * Valida que el payload autenticado tenga el permiso security.auth.test.
   */
  server.get('/security/authorization/permission', {
    preHandler: async function (request, reply) {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = authorization.requirePermissions({
        payload: request.auth!.payload,
        requiredPermissions: [
          'security.auth.test'
        ],
        mode: 'all'
      });

      options.logger.info('Solicitud autorizada correctamente por permiso.', {
        package: '@jarvis/security',
        event: 'security.authorization.permission.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        requiredPermissions: [
          'security.auth.test'
        ],
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Permiso autorizado correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la solicitud por permiso.', {
        package: '@jarvis/security',
        event: 'security.authorization.permission.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });

  /**
   * Ruta protegida por rol y permiso.
   *
   * Valida que el payload autenticado tenga:
   *
   * - Rol: admin
   * - Permiso: security.auth.test
   */
  server.get('/security/authorization/admin', {
    preHandler: async function (request, reply) {
      await authenticate.call(server, request, reply);
    }
  }, async (request, reply) => {
    try {
      const result = authorization.authorize({
        payload: request.auth!.payload,
        requiredRoles: [
          'admin'
        ],
        requiredPermissions: [
          'security.auth.test'
        ],
        mode: 'all'
      });

      options.logger.info('Solicitud autorizada correctamente por rol y permiso.', {
        package: '@jarvis/security',
        event: 'security.authorization.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        requiredRoles: [
          'admin'
        ],
        requiredPermissions: [
          'security.auth.test'
        ],
        subject: request.auth?.payload.subject
      });

      return createSuccessResponse({
        message: 'Rol y permiso autorizados correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autorizar la solicitud.', {
        package: '@jarvis/security',
        event: 'security.authorization.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });
}
