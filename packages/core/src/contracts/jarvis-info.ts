/**
 * Se importa como type porque solo se usa para describir
 * la información de los módulos registrados en el runtime.
 */
import type {
  JarvisModuleInfo
} from './jarvis-module.js';

/**
 * Se importa como type porque solo se usa para indicar
 * el ambiente en el que está corriendo la aplicación.
 */
import type {
  JarvisEnvironment
} from './jarvis-options.js';

/**
 * Información normalizada de la aplicación arrancada por J.A.R.V.I.S.
 *
 * Esta información viene de JarvisOptions, pero aquí ya se reporta
 * completa y normalizada después del arranque.
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
 * Aquí host y port son obligatorios porque J.A.R.V.I.S.
 * ya resolvió sus valores por defecto durante el arranque.
 */
export interface JarvisServerInfo {
  /**
   * Host donde escucha el servidor.
   */
  host: string;

  /**
   * Puerto donde escucha el servidor.
   */
  port: number;
}

/**
 * Información general reportada por una instancia viva de J.A.R.V.I.S.
 *
 * Este contrato representa la respuesta de J.info().
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
   * Información de la aplicación arrancada.
   */
  app: JarvisAppInfo;

  /**
   * Información del servidor configurado.
   */
  server: JarvisServerInfo;

  /**
   * Módulos registrados dentro del runtime.
   */
  modules: JarvisModuleInfo[];

  /**
   * Estado actual del runtime.
   *
   * Por ahora solo usamos "bootstrapped" porque J.A.R.V.I.S.
   * ya completó su arranque inicial.
   */
  status: 'bootstrapped';
}
