import type {
  JarvisServerInfo
} from '@jarvis/core';

/**
 * Opciones HTTP/HTTPS normalizadas para crear el servidor de Sandbox-API.
 *
 * Esta interfaz representa la configuración final que necesita la capa HTTP
 * para crear Fastify, escuchar en un host/puerto y construir una URL legible
 * para logs o pruebas locales.
 */
export interface SandboxHttpOptions {
  /**
   * Host donde escuchará el servidor.
   *
   * Este valor viene normalizado desde core.info().server.host.
   */
  host: string;

  /**
   * Puerto donde escuchará el servidor.
   *
   * Este valor viene normalizado desde core.info().server.port.
   */
  port: number;

  /**
   * Protocolo activo del servidor.
   *
   * Puede ser:
   * - http
   * - https
   */
  protocol: JarvisServerInfo['protocol'];

  /**
   * URL pública sugerida para logs y pruebas locales.
   *
   * Si el servidor escucha en 0.0.0.0, esta URL usa localhost para facilitar
   * la apertura desde navegador, REST Client o herramientas similares.
   */
  url: string;

  /**
   * Configuración HTTPS normalizada.
   */
  https: JarvisServerInfo['https'];
}

/**
 * Resuelve el host público usado para logs y pruebas locales.
 *
 * Fastify puede escuchar en 0.0.0.0 para aceptar conexiones desde fuera del
 * contenedor, pero esa dirección no es la más cómoda para abrir en navegador.
 *
 * Por eso, cuando el host interno es 0.0.0.0, la URL pública sugerida usa
 * localhost.
 */
function resolvePublicHost(host: string): string {
  if (host === '0.0.0.0') {
    return 'localhost';
  }

  return host;
}

/**
 * Valida la consistencia entre protocol y server.https.
 *
 * Aunque @jarvis/bootstrap ya valida esta configuración, Sandbox-API mantiene
 * esta segunda validación como defensa local antes de crear el servidor.
 *
 * Reglas:
 * - Si protocol es https, server.https.enabled debe estar activo.
 * - Si server.https.enabled está activo, protocol debe ser https.
 * - Si HTTPS está activo, debe existir keyFile.
 * - Si HTTPS está activo, debe existir certFile.
 */
function validateHttpOptions(server: JarvisServerInfo): void {
  if (server.protocol === 'https' && !server.https.enabled) {
    throw new Error('Sandbox-API | server.protocol está configurado como https, pero server.https.enabled no está activo.');
  }

  if (server.protocol === 'http' && server.https.enabled) {
    throw new Error('Sandbox-API | server.https.enabled está activo, pero server.protocol no está configurado como https.');
  }

  if (server.protocol === 'https' && !server.https.keyFile) {
    throw new Error('Sandbox-API | HTTPS está activo, pero no se configuró server.https.keyFile.');
  }

  if (server.protocol === 'https' && !server.https.certFile) {
    throw new Error('Sandbox-API | HTTPS está activo, pero no se configuró server.https.certFile.');
  }
}

/**
 * Resuelve la configuración HTTP/HTTPS final de Sandbox-API.
 *
 * Esta función recibe la información del servidor ya normalizada por
 * @jarvis/bootstrap y @jarvis/core mediante core.info().server.
 *
 * Esto permite que:
 * - @jarvis/bootstrap lea y normalice settings.json.
 * - @jarvis/core conserve y exponga la configuración normalizada.
 * - Sandbox-API use esa configuración para crear HTTP o HTTPS.
 *
 * @param server Configuración normalizada disponible desde core.info().server.
 *
 * @returns Opciones normalizadas para crear el servidor HTTP/HTTPS.
 */
export function resolveSandboxHttpOptions(
  server: JarvisServerInfo
): SandboxHttpOptions {
  validateHttpOptions(server);

  return {
    host: server.host,
    port: server.port,
    protocol: server.protocol,
    url: `${server.protocol}://${resolvePublicHost(server.host)}:${server.port}`,
    https: server.https
  };
}
