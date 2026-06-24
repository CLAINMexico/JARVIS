/**
 * Estados posibles para un módulo registrado dentro de J.A.R.V.I.S.
 *
 * registered:
 * El módulo fue registrado correctamente en el runtime.
 *
 * disabled:
 * El módulo existe, pero está deshabilitado.
 *
 * error:
 * El módulo tuvo algún problema durante su registro o ejecución.
 */
export type JarvisModuleStatus = 'registered' | 'disabled' | 'error';

/**
 * Configuración de un módulo recibida durante Jarvis.boot().
 *
 * Este contrato representa la forma en la que una aplicación puede
 * pedirle a J.A.R.V.I.S. que registre un módulo inicial.
 */
export interface JarvisModuleOptions {
  /**
   * Nombre único del módulo.
   *
   * Ejemplos:
   * config
   * logger
   * license
   * database
   */
  name: string;

  /**
   * Estado inicial del módulo.
   *
   * Si no se define, J.A.R.V.I.S. usará "registered" por defecto.
   */
  status?: JarvisModuleStatus;
}

/**
 * Información normalizada de un módulo dentro del runtime.
 *
 * A diferencia de JarvisModuleOptions, aquí el status ya es obligatorio
 * porque J.A.R.V.I.S. siempre completa un estado final para cada módulo.
 */
export interface JarvisModuleInfo {
  /**
   * Nombre único del módulo registrado.
   */
  name: string;

  /**
   * Estado actual del módulo dentro del runtime.
   */
  status: JarvisModuleStatus;
}
