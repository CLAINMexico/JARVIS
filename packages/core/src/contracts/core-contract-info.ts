import type {
  JarvisModuleInfo
} from './core-contract-module.js';

import type {
  JarvisEnvironment
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
 * host y port son obligatorios porque J.A.R.V.I.S. ya resolvió sus valores
 * por defecto durante el arranque.
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
  name: 'J.A.R.V.I.S.';

  /**
   * Descripción oficial del runtime.
   */
  description: 'JavaScript Architecture Runtime for Versatile Intelligent Services';

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
   *
   * Por ahora se usa bootstrapped para indicar que J.A.R.V.I.S.
   * completó su arranque inicial.
   */
  status: 'bootstrapped';
}
