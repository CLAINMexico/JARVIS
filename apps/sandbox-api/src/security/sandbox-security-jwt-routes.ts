import type {
  FastifyInstance
} from 'fastify';

import type {
  LoggerService
} from '@jarvis/logger';

import type {
  SecurityJwtPayload,
  SecurityJwtService
} from '@jarvis/security';

import {
  badRequest,
  createErrorResponse,
  createSuccessResponse
} from '@jarvis/http';

/**
 * Body esperado para firmar tokens JWT desde Sandbox-API.
 */
interface SandboxSecurityJwtSignBody extends SecurityJwtPayload { }

/**
 * Body esperado para verificar tokens JWT desde Sandbox-API.
 */
interface SandboxSecurityJwtVerifyBody {
  /**
   * Token JWT que será verificado por @jarvis/security.
   */
  token?: string;
}

/**
 * Valida si un valor tiene forma básica de objeto.
 */
function isSandboxObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Registra las rutas HTTP de prueba para @jarvis/security.
 *
 * Estas rutas permiten validar desde HTTP que Sandbox-API puede firmar y
 * verificar tokens JWT usando SecurityJwtService.
 *
 * Importante:
 * Estas rutas son de prueba. La protección real de rutas se implementará
 * posteriormente mediante middleware HTTP.
 */
export function registerSandboxSecurityJwtRoutes(
  server: FastifyInstance,
  securityJwt: SecurityJwtService,
  logger: LoggerService
): void {
  /**
   * Ruta de prueba para firmar tokens JWT.
   */
  server.post('/security/jwt/sign', async (request, reply) => {
    try {
      if (!isSandboxObject(request.body)) {
        const error = badRequest('Body inválido para generar token JWT.', {
          package: '@jarvis/security',
          event: 'security.jwt.sign.body.invalid'
        });

        const response = createErrorResponse(error);

        return reply
          .status(response.statusCode)
          .send(response);
      }

      const body = request.body as unknown as SandboxSecurityJwtSignBody;
      const token = await securityJwt.sign(body);

      logger.info('Token JWT generado correctamente.', {
        package: '@jarvis/security',
        event: 'security.jwt.sign.success',
        statusCode: 200,
        route: '/security/jwt/sign',
        method: 'POST',
        tokenType: body.tokenType,
        subject: body.subject
      });

      return createSuccessResponse({
        message: 'Token JWT generado correctamente.',
        data: {
          token
        }
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      logger.warn('No se pudo generar el token JWT.', {
        package: '@jarvis/security',
        event: 'security.jwt.sign.failed',
        statusCode: response.statusCode,
        route: '/security/jwt/sign',
        method: 'POST',
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });

  /**
   * Ruta de prueba para verificar tokens JWT.
   */
  server.post('/security/jwt/verify', async (request, reply) => {
    try {
      if (!isSandboxObject(request.body)) {
        const error = badRequest('Body inválido para verificar token JWT.', {
          package: '@jarvis/security',
          event: 'security.jwt.verify.body.invalid'
        });

        const response = createErrorResponse(error);

        return reply
          .status(response.statusCode)
          .send(response);
      }

      const body = request.body as SandboxSecurityJwtVerifyBody;
      const token = typeof body.token === 'string' ? body.token : '';
      const result = await securityJwt.verify(token);

      logger.info('Token JWT verificado correctamente.', {
        package: '@jarvis/security',
        event: 'security.jwt.verify.success',
        statusCode: 200,
        route: '/security/jwt/verify',
        method: 'POST',
        tokenType: result.payload.tokenType,
        subject: result.payload.subject
      });

      return createSuccessResponse({
        message: 'Token JWT verificado correctamente.',
        data: result
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      logger.warn('No se pudo verificar el token JWT.', {
        package: '@jarvis/security',
        event: 'security.jwt.verify.failed',
        statusCode: response.statusCode,
        route: '/security/jwt/verify',
        method: 'POST',
        error
      });

      return reply
        .status(response.statusCode)
        .send(response);
    }
  });
}
