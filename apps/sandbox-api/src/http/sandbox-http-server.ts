import Fastify from 'fastify';

import type {
  FastifyInstance
} from 'fastify';

/**
 * Crea el servidor HTTP de Sandbox API.
 *
 * Esta función centraliza la creación de la instancia de Fastify para evitar
 * que main.ts conozca detalles internos de inicialización del servidor HTTP.
 *
 * En esta versión el servidor se crea sin logger interno de Fastify, ya que
 * J.A.R.V.I.S. utiliza @jarvis/logger como sistema principal de bitácoras.
 */
export function createSandboxHttpServer(): FastifyInstance {
  return Fastify({
    logger: false
  });
}
