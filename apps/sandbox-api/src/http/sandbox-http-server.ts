import {
  readFile
} from 'node:fs/promises';

import Fastify from 'fastify';

import type {
  FastifyInstance
} from 'fastify';

import type {
  SandboxHttpOptions
} from './sandbox-http-options.js';

/**
 * Crea el servidor HTTP/HTTPS de Sandbox-API.
 *
 * Esta función centraliza la creación de la instancia de Fastify para evitar
 * que main.ts conozca detalles internos de inicialización del servidor.
 *
 * En modo HTTP, Fastify se crea sin configuración adicional de transporte.
 *
 * En modo HTTPS, se leen los archivos configurados en settings.json:
 * - server.https.keyFile
 * - server.https.certFile
 *
 * En esta versión el servidor se crea sin logger interno de Fastify, ya que
 * J.A.R.V.I.S. utiliza @jarvis/logger como sistema principal de bitácoras.
 */
export async function createSandboxHttpServer(
  options: SandboxHttpOptions
): Promise<FastifyInstance> {
  if (options.protocol === 'https') {
    const keyFile = options.https.keyFile;
    const certFile = options.https.certFile;

    if (!keyFile || !certFile) {
      throw new Error('Sandbox-API | HTTPS requiere keyFile y certFile.');
    }

    const [
      key,
      cert
    ] = await Promise.all([
      readFile(keyFile),
      readFile(certFile)
    ]);

    return Fastify({
      logger: false,
      https: {
        key,
        cert
      }
    });
  }

  return Fastify({
    logger: false
  });
}
