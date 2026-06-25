import type {
  JarvisEnvironment
} from '@jarvis/core';

/**
 * Configuración normalizada de la aplicación.
 *
 * Esta estructura se entrega lista para usarse en Jarvis.boot().
 */
export interface BootstrapApp {
  /**
   * Nombre de la aplicación.
   */
  name: string;

  /**
   * Descripción de la aplicación.
   */
  description: string;

  /**
   * Versión de la aplicación.
   */
  version: string;

  /**
   * Ambiente de ejecución.
   */
  environment: JarvisEnvironment;

  /**
   * Licencia o referencia de licencia asociada a la aplicación.
   */
  license?: string;

  /**
   * Zona horaria usada por la aplicación.
   */
  timeZone: string;
}
