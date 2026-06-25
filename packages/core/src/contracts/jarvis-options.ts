/**
 * Se importa como type porque solo se usa para describir la forma
 * de los módulos que puede recibir J.A.R.V.I.S. al arrancar.
 *
 * Al usar import type, TypeScript sabe que este import no necesita
 * existir como código JavaScript en tiempo de ejecución.
 */
import type {
  JarvisModuleOptions
} from './jarvis-module.js';

/**
 * Se importa como type porque solo se usa para describir módulos vivos
 * que pueden participar en el ciclo de vida del runtime.
 */
import type {
  JarvisRuntimeModule
} from './jarvis-runtime-module.js';

/**
 * Ambientes soportados por el runtime de J.A.R.V.I.S.
 *
 * Estos valores ayudan a identificar en qué contexto está corriendo
 * la aplicación: local, desarrollo, pruebas, staging o producción.
 */
export type JarvisEnvironment = 'local' | 'development' | 'testing' | 'staging' | 'production';

/**
 * Configuración principal de la aplicación que será arrancada
 * por J.A.R.V.I.S.
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
   * JavaScript Architecture Runtime for Versatile Intelligent Services
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
   * Si no se define, J.A.R.V.I.S. usará "local" por defecto.
   */
  environment?: JarvisEnvironment;
}

/**
 * Configuración opcional del servidor usado por el runtime.
 */
export interface JarvisServerOptions {
  /**
   * Host donde escuchará el servidor.
   *
   * Si no se define, J.A.R.V.I.S. usará "0.0.0.0" por defecto.
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
 * Este contrato define todo lo que se puede enviar al momento
 * de arrancar una instancia de J.A.R.V.I.S.
 */
export interface JarvisOptions {
  /**
   * Información principal de la aplicación.
   *
   * Esta propiedad es obligatoria porque J.A.R.V.I.S. necesita
   * saber qué aplicación está arrancando.
   */
  app: JarvisAppOptions;

  /**
   * Configuración opcional del servidor.
   *
   * Si no se define, J.A.R.V.I.S. usará valores por defecto.
   */
  server?: JarvisServerOptions;

  /**
   * Lista inicial de módulos informativos que serán registrados
   * en el runtime.
   *
   * Estos módulos solo describen nombre y estado.
   */
  modules?: JarvisModuleOptions[];

  /**
   * Lista inicial de módulos vivos del runtime.
   *
   * Estos módulos pueden incluir comportamiento de ciclo de vida,
   * por ejemplo boot() y shutdown().
   */
  runtimeModules?: JarvisRuntimeModule[];
}
