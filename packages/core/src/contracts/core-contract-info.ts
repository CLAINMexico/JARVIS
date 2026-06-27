import type {
  JarvisModuleInfo
} from './core-contract-module.js';

import type {
  JarvisEnvironment,
  JarvisServerHttpsOptions,
  JarvisServerProtocol
} from './core-contract-options.js';

/**
 * Información normalizada de la aplicación arrancada por J.A.R.V.I.S.
 *
 * Esta información proviene de JarvisOptions, pero aquí se reporta
 * completa y normalizada después del arranque del runtime.
 */
export interface JarvisAppInfo {
  /**
   * Nombre de la aplicación arrancada.
   */
  name: string;

  /**
   * Descripción de la aplicación arrancada.
   */
  description: string;

  /**
   * Versión de la aplicación arrancada.
   */
  version: string;

  /**
   * Ambiente actual de ejecución.
   */
  environment: JarvisEnvironment;
}

/**
 * Información normalizada del servidor usado por el runtime.
 *
 * host, port y protocol son obligatorios porque J.A.R.V.I.S. ya resolvió sus
 * valores por defecto durante el arranque.
 */
export interface JarvisServerInfo {
  /**
   * Host configurado para el servidor.
   */
  host: string;

  /**
   * Puerto configurado para el servidor.
   */
  port: number;

  /**
   * Protocolo configurado para la capa HTTP de la aplicación.
   *
   * Esta información permite que una aplicación conectada al runtime decida
   * si debe crear un servidor HTTP o HTTPS.
   */
  protocol: JarvisServerProtocol;

  /**
   * Configuración HTTPS normalizada.
   *
   * El core solo reporta esta información. La aplicación HTTP es responsable
   * de leer certificados y crear el servidor seguro cuando corresponda.
   */
  https: JarvisServerHttpsOptions;
}

/**
 * Información general reportada por una instancia viva de J.A.R.V.I.S.
 *
 * Este contrato representa la respuesta de core.info().
 */
export interface JarvisInfo {
  /**
   * Nombre oficial del runtime.
   */
  name: string;

  /**
   * Descripción oficial del runtime.
   */
  description: string;

  /**
   * Información normalizada de la aplicación arrancada.
   */
  app: JarvisAppInfo;

  /**
   * Información normalizada del servidor configurado.
   */
  server: JarvisServerInfo;

  /**
   * Módulos registrados dentro del runtime.
   */
  modules: JarvisModuleInfo[];

  /**
   * Estado actual del runtime.
   */
  status: string;
}
