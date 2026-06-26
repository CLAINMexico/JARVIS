import type {
  LoggerLevel
} from './logger-level.js';

/**
 * Define las opciones disponibles para configurar @jarvis/logger.
 *
 * Estas opciones permiten controlar el estado general del logger,
 * el nivel mínimo de escritura, el módulo por defecto, la zona horaria
 * y los transports disponibles.
 */
export interface LoggerOptions {
  /**
   * Permite prender o apagar el logger completo.
   *
   * Cuando enabled es false:
   * - El servicio logger sigue existiendo.
   * - No se escribe en consola.
   * - No se escriben archivos.
   * - No se imprimen mensajes de boot/shutdown.
   *
   * Esto mantiene seguro el uso de core.service('logger') para otros packages.
   */
  enabled?: boolean;

  /**
   * Nombre de la aplicación usado para construir nombres de archivos.
   *
   * Ejemplo:
   * JARVIS_APPNAME
   */
  appName?: string;

  /**
   * Nivel mínimo que será procesado por el logger.
   *
   * Si level es info, se ignoran logs debug.
   */
  level?: LoggerLevel;

  /**
   * Módulo por defecto usado cuando el log no recibe uno explícito.
   */
  defaultModule?: string;

  /**
   * Zona horaria usada para formatear fechas y construir rutas de logs.
   *
   * Ejemplo:
   * America/Mexico_City
   */
  timeZone?: string;

  /**
   * Configuración de salida en consola.
   */
  console?: {
    /**
     * Habilita o deshabilita la escritura en consola.
     */
    enabled?: boolean;

    /**
     * Habilita o deshabilita colores ANSI en consola.
     */
    colors?: boolean;
  };

  /**
   * Configuración de salida en archivos.
   */
  file?: {
    /**
     * Habilita o deshabilita la escritura en archivos.
     */
    enabled?: boolean;

    /**
     * Ruta base donde se crearán los archivos de log.
     */
    path?: string;

    /**
     * Si está activo, crea archivos separados por nivel.
     */
    splitByLevel?: boolean;

    /**
     * Si está activo, escribe todos los logs en un archivo ALL.
     */
    writeAll?: boolean;
  };
}
