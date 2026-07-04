import type {
  FastifyInstance
} from 'fastify';

import type {
  JarvisApplication
} from '@jarvis/core';

import {
  createErrorResponse,
  createSuccessResponse,
  unauthorized
} from '@jarvis/http';

/**
 * Registra las rutas HTTP base de Sandbox-API.
 *
 * Estas rutas permiten validar que el servidor HTTP está activo y que puede
 * exponer información básica del runtime de J.A.R.V.I.S.
 */
export function registerSandboxHttpRoutes(
  server: FastifyInstance,
  core: JarvisApplication
): void {
  const instance = core.info();

  /**
   * Ruta raíz de Sandbox-API.
   *
   * Permite validar rápidamente que la API está disponible y muestra
   * las rutas base expuestas por esta versión del sandbox.
   */
  server.get('/', async () => ({
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
      '/http/error'
    ]
  }));

  /**
   * Ruta básica de salud.
   *
   * Permite validar que el servidor HTTP está vivo.
   */
  server.get('/health', async () => ({
    status: 'ok',
    app: instance.app.name,
    runtime: instance.name,
    environment: instance.app.environment
  }));

  /**
   * Ruta de información general del runtime.
   *
   * Devuelve la misma información expuesta por core.info().
   */
  server.get('/info', async () => core?.info());

  /**
   * Ruta de módulos registrados.
   *
   * Devuelve la lista de módulos conocidos por el runtime.
   */
  server.get('/modules', async () => core?.modules());
  /**
   * Ruta de prueba para respuestas exitosas usando @jarvis/http.
   *
   * Esta ruta valida que Sandbox API puede consumir createSuccessResponse()
   * desde el paquete @jarvis/http.
   */
  server.get('/http/success', async () => createSuccessResponse({
    message: 'Respuesta exitosa generada por @jarvis/http.',
    data: {
      package: '@jarvis/http',
      helper: 'createSuccessResponse'
    }
  }));

  /**
   * Ruta de prueba para errores controlados usando @jarvis/http.
   *
   * Esta ruta valida que Sandbox API puede crear un JarvisHttpError mediante
   * helpers de @jarvis/http y convertirlo a una respuesta segura.
   */
  server.get('/http/error', async (_request, reply) => {
    const error = unauthorized('Token inválido o ausente.', {
      package: '@jarvis/http',
      helper: 'unauthorized'
    });

    const response = createErrorResponse(error);

    return reply
      .status(response.statusCode)
      .send(response);
  });
}
