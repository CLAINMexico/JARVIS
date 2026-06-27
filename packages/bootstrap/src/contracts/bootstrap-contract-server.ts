import type {
  JarvisServerHttpsOptions,
  JarvisServerProtocol
} from '@jarvis/core';

/**
 * Configuración normalizada del servidor.
 *
 * Esta estructura se entrega lista para usarse en Jarvis.boot().
 *
 * Importante:
 * @jarvis/bootstrap no crea servidores HTTP ni HTTPS. Solo lee settings.json,
 * normaliza la configuración y la entrega a @jarvis/core para que la aplicación
 * pueda usarla posteriormente.
 */
export interface BootstrapServer {
  /**
   * Host donde escuchará la aplicación.
   *
   * Este valor ya fue normalizado por @jarvis/bootstrap.
   */
  host: string;

  /**
   * Puerto donde escuchará la aplicación.
   *
   * Este valor ya fue normalizado por @jarvis/bootstrap.
   */
  port: number;

  /**
   * Protocolo configurado para la capa HTTP de la aplicación.
   *
   * Puede ser:
   * - http
   * - https
   *
   * Este valor permite que una aplicación como Sandbox-API decida si debe
   * crear un servidor HTTP o HTTPS.
   */
  protocol: JarvisServerProtocol;

  /**
   * Configuración HTTPS normalizada.
   *
   * Esta configuración solo se transporta desde settings.json hacia el runtime.
   * La lectura real de certificados corresponde a la aplicación HTTP.
   */
  https: JarvisServerHttpsOptions;
}
