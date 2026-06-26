import type {
  JarvisModuleOptions
} from './core-contract-module.js';

import type {
  JarvisRuntimeModule
} from './core-contract-runtime-module.js';

/**
 * Ambientes soportados por el runtime de J.A.R.V.I.S.
 *
 * Estos valores permiten identificar el contexto donde se está ejecutando
 * una aplicación.
 */
export type JarvisEnvironment = 'local' | 'development' | 'testing' | 'staging' | 'production';

/**
 * Configuración principal de la aplicación que será arrancada por J.A.R.V.I.S.
 *
 * Esta estructura permite que el runtime conozca la identidad base de la
 * aplicación antes de iniciar módulos o exponer servicios.
 */
export interface JarvisAppOptions {
  /**
   * Nombre legible de la aplicación.
   *
   * Ejemplo:
   * J.A.R.V.I.S. Sandbox API
   */
  name: string;

  /**
   * Descripción legible de la aplicación.
   *
   * Ejemplo:
   * Ambiente de pruebas para aplicaciones de tipo API.
   */
  description: string;

  /**
   * Versión de la aplicación.
   *
   * Ejemplo:
   * 0.1.0
   */
  version: string;

  /**
   * Ambiente actual de ejecución.
   *
   * Si no se define, J.A.R.V.I.S. usará local por defecto.
   */
  environment?: JarvisEnvironment;
}

/**
 * Configuración opcional del servidor asociado al runtime.
 *
 * Esta configuración describe dónde debería escuchar la aplicación backend
 * cuando exista una capa HTTP conectada al runtime.
 */
export interface JarvisServerOptions {
  /**
   * Host donde escuchará el servidor.
   *
   * Si no se define, J.A.R.V.I.S. usará 0.0.0.0 por defecto.
   */
  host?: string;

  /**
   * Puerto donde escuchará el servidor.
   *
   * Si no se define, J.A.R.V.I.S. usará 3000 por defecto.
   */
  port?: number;
}

/**
 * Configuración raíz aceptada por Jarvis.boot().
 *
 * Este contrato define los valores que una aplicación puede entregar al
 * momento de arrancar una instancia de J.A.R.V.I.S.
 */
export interface JarvisOptions {
  /**
   * Información principal de la aplicación.
   *
   * Esta propiedad es obligatoria porque J.A.R.V.I.S. necesita saber qué
   * aplicación está arrancando.
   */
  app: JarvisAppOptions;

  /**
   * Configuración opcional del servidor.
   *
   * Si no se define, J.A.R.V.I.S. usará valores por defecto.
   */
  server?: JarvisServerOptions;

  /**
   * Lista inicial de módulos informativos registrados en el runtime.
   *
   * Estos módulos solo describen nombre y estado. No ejecutan boot(),
   * shutdown() ni exponen servicios.
   */
  modules?: JarvisModuleOptions[];

  /**
   * Lista inicial de módulos vivos del runtime.
   *
   * Estos módulos pueden participar en el ciclo de vida mediante boot()
   * y shutdown(). También pueden exponer un service para ser consultado
   * desde core.service(name).
   */
  runtimeModules?: JarvisRuntimeModule[];
}
