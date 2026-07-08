import './sandbox-security-auth-context.js';

import type {
  FastifyReply,
  FastifyRequest,
  preHandlerAsyncHookHandler
} from 'fastify';

import {
  createErrorResponse
} from '@jarvis/http';

import type {
  LoggerService
} from '@jarvis/logger';

import type {
  SecurityAuthService,
  SecurityJwtTokenType
} from '@jarvis/security';

/**
 * Opciones para crear el preHandler de autenticación de Sandbox-API.
 */
export interface SandboxSecurityAuthPreHandlerOptions {
  /**
   * Servicio universal de autenticación de @jarvis/security.
   */
  securityAuth: SecurityAuthService;

  /**
   * Logger de la aplicación.
   */
  logger: LoggerService;

  /**
   * Tipos de token permitidos para la ruta protegida.
   */
  allowedTokenTypes?: SecurityJwtTokenType[];
}

/**
 * PreHandler de autenticación usado por rutas protegidas de Sandbox-API.
 */
export type SandboxSecurityAuthPreHandler = preHandlerAsyncHookHandler;

/**
 * Crea un preHandler de Fastify para autenticar solicitudes mediante Bearer Token.
 */
export function createSandboxSecurityAuthPreHandler(
  options: SandboxSecurityAuthPreHandlerOptions
): SandboxSecurityAuthPreHandler {
  const authenticate: preHandlerAsyncHookHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      const auth = await options.securityAuth.authenticateBearer({
        authorizationHeader: request.headers.authorization,
        allowedTokenTypes: options.allowedTokenTypes ?? [
          'access'
        ]
      });

      request.auth = auth;

      options.logger.info('Solicitud autenticada correctamente.', {
        package: '@jarvis/security',
        event: 'security.auth.bearer.success',
        statusCode: 200,
        route: request.url,
        method: request.method,
        tokenType: auth.payload.tokenType,
        subject: auth.payload.subject
      });
    } catch (error: unknown) {
      const response = createErrorResponse(error);

      options.logger.warn('No se pudo autenticar la solicitud.', {
        package: '@jarvis/security',
        event: 'security.auth.bearer.failed',
        statusCode: response.statusCode,
        route: request.url,
        method: request.method,
        error
      });

      await reply
        .status(response.statusCode)
        .send(response);
    }
  };

  return authenticate;
}
