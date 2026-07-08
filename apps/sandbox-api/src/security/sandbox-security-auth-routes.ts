import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from 'fastify';

import type {
  LoggerService
} from '@jarvis/logger';

import type {
  SecurityAuthResult
} from '@jarvis/security';

import {
  createErrorResponse,
  createSuccessResponse,
  unauthorized
} from '@jarvis/http';

/**
 * PreHandler compatible con Fastify para rutas protegidas.
 */
type SandboxSecurityAuthPreHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => unknown | Promise<unknown>;

/**
 * Obtiene el contexto autenticado desde el request de Fastify.
 *
 * Si por alguna razón la ruta protegida se ejecuta sin request.auth, se genera
 * un error controlado para evitar respuestas inconsistentes.
 */
function getSandboxSecurityAuth(
  auth: SecurityAuthResult | undefined
): SecurityAuthResult {
  if (!auth) {
    throw unauthorized('Contexto de autenticación ausente.', {
      package: '@jarvis/security',
      event: 'security.auth.context.missing'
    });
  }

  return auth;
}

/**
 * Registra rutas protegidas de prueba para validar Bearer Auth.
 */
export function registerSandboxSecurityAuthRoutes(
  server: FastifyInstance,
  authenticate: SandboxSecurityAuthPreHandler,
  logger: LoggerService
): void {
  /**
   * Ruta protegida básica.
   */
  server.get('/security/protected', {
    preHandler: async (request, reply) => {
      await authenticate(request, reply);
    }
  }, async () => {
    return createSuccessResponse({
      message: 'Acceso autorizado correctamente.',
      data: {
        authorized: true
      }
    });
  });

  /**
   * Ruta protegida que devuelve el payload autenticado.
   */
  server.get('/security/me', {
    preHandler: async (request, reply) => {
      await authenticate(request, reply);
    }
  }, async (request) => {
    return createSuccessResponse({
      message: 'Payload autenticado obtenido correctamente.',
      data: {
        payload: request.auth?.payload
      }
    });
  });
}
