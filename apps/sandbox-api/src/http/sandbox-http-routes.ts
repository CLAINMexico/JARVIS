import type {
  FastifyInstance
} from 'fastify';

import type {
  JarvisApplication
} from '@jarvis/core';

import type {
  LoggerService
} from '@jarvis/logger';

import type {
  SecurityAuthService,
  SecurityJwtService
} from '@jarvis/security';

import {
  createErrorResponse,
  createSuccessResponse,
  unauthorized
} from '@jarvis/http';

import {
  registerSandboxSecurityJwtRoutes
} from '../security/sandbox-security-jwt-routes.js';

import {
  createSandboxSecurityAuthPreHandler
} from '../security/sandbox-security-auth-pre-handler.js';

import {
  registerSandboxSecurityAuthRoutes
} from '../security/sandbox-security-auth-routes.js';

/**
 * Paquete visual usado por los logs propios de Sandbox-API.
 */
const SandboxPackageName = 'Sandbox-API';

/**
 * Registra las rutas HTTP base de Sandbox-API.
 *
 * Estas rutas permiten validar que el servidor HTTP está activo, que puede
 * exponer información básica del runtime de J.A.R.V.I.S. y que responde con
 * el formato estándar de @jarvis/http.
 */
export function registerSandboxHttpRoutes(
  server: FastifyInstance,
  core: JarvisApplication,
  securityJwt: SecurityJwtService,
  securityAuth: SecurityAuthService
): void {
  const instance = core.info();
  const logger = core.service('logger') as LoggerService;

  /**
   * Registra rutas de prueba para JWT de @jarvis/security.
   */
  registerSandboxSecurityJwtRoutes(
    server,
    securityJwt,
    logger
  );

  /**
   * Crea el adaptador Fastify para Bearer Auth.
   *
   * @jarvis/security conserva la lógica universal de autenticación y
   * Sandbox-API adapta esa lógica al ciclo de vida HTTP de Fastify.
   */
  const authenticate = createSandboxSecurityAuthPreHandler({
    securityAuth,
    logger,
    allowedTokenTypes: [
      'access'
    ]
  });

  /**
   * Registra rutas protegidas para validar Bearer Auth.
   */
  registerSandboxSecurityAuthRoutes(
    server,
    authenticate,
    logger
  );

  /**
   * Ruta raíz de Sandbox-API.
   *
   * Permite validar rápidamente que la API está disponible y muestra las rutas
   * base expuestas por esta versión del sandbox.
   */
  server.get('/', async () => {
    logger.info('Ruta raíz consultada correctamente.', {
      package: SandboxPackageName,
      event: 'sandbox.root.success',
      statusCode: 200,
      route: '/',
      method: 'GET'
    });

    return createSuccessResponse({
      message: 'Sandbox-API se encuentra en ejecución.',
      data: {
        name: `${instance.name} | ${instance.app.name}`,
        status: 'running',
        runtime: instance.name,
        app: instance.app.name,
        environment: instance.app.environment,
        routes: [
          '/',
          '/health',
          '/info',
          '/modules',
          '/http/success',
          '/http/error',
          '/security/jwt/sign',
          '/security/jwt/verify',
          '/security/protected',
          '/security/me'
        ]
      }
    });
  });

  /**
   * Ruta básica de salud.
   *
   * Permite validar que el servidor HTTP está vivo.
   */
  server.get('/health', async () => {
    logger.info('Estado de salud consultado correctamente.', {
      package: SandboxPackageName,
      event: 'sandbox.health.success',
      statusCode: 200,
      route: '/health',
      method: 'GET'
    });

    return createSuccessResponse({
      message: 'Sandbox-API se encuentra disponible.',
      data: {
        status: 'ok',
        app: instance.app.name,
        runtime: instance.name,
        environment: instance.app.environment
      }
    });
  });

  /**
   * Ruta de información general del runtime.
   *
   * Devuelve la misma información expuesta por core.info().
   */
  server.get('/info', async () => {
    logger.info('Información del runtime consultada correctamente.', {
      package: SandboxPackageName,
      event: 'sandbox.info.success',
      statusCode: 200,
      route: '/info',
      method: 'GET'
    });

    return createSuccessResponse({
      message: 'Información del runtime consultada correctamente.',
      data: core.info()
    });
  });

  /**
   * Ruta de módulos registrados.
   *
   * Devuelve la lista de módulos conocidos por el runtime.
   */
  server.get('/modules', async () => {
    logger.info('Módulos del runtime consultados correctamente.', {
      package: SandboxPackageName,
      event: 'sandbox.modules.success',
      statusCode: 200,
      route: '/modules',
      method: 'GET'
    });

    return createSuccessResponse({
      message: 'Módulos del runtime consultados correctamente.',
      data: {
        modules: core.modules()
      }
    });
  });

  /**
   * Ruta de prueba para respuestas exitosas usando @jarvis/http.
   *
   * Esta ruta valida que Sandbox-API puede consumir createSuccessResponse()
   * desde el paquete @jarvis/http.
   */
  server.get('/http/success', async () => {
    logger.info('Respuesta exitosa generada por @jarvis/http.', {
      package: '@jarvis/http',
      event: 'http.response.success',
      statusCode: 200,
      route: '/http/success',
      method: 'GET'
    });

    return createSuccessResponse({
      message: 'Respuesta exitosa generada por @jarvis/http.',
      data: {
        package: '@jarvis/http',
        helper: 'createSuccessResponse'
      }
    });
  });

  /**
   * Ruta de prueba para errores controlados usando @jarvis/http.
   *
   * Esta ruta valida que Sandbox-API puede crear un JarvisHttpError mediante
   * helpers de @jarvis/http y convertirlo a una respuesta segura.
   */
  server.get('/http/error', async (_request, reply) => {
    const error = unauthorized('Token inválido o ausente.', {
      package: '@jarvis/http',
      helper: 'unauthorized'
    });

    const response = createErrorResponse(error);

    logger.warn('Token inválido o ausente.', {
      package: '@jarvis/http',
      event: 'http.response.error',
      statusCode: response.statusCode,
      route: '/http/error',
      method: 'GET',
      code: response.error.code
    });

    return reply
      .status(response.statusCode)
      .send(response);
  });
}
