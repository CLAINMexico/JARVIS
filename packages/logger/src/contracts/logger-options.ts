import type {
  LoggerLevel
} from './logger-level.js';

/**
 * Opciones de configuración para @jarvis/logger.
 */
export interface LoggerOptions {
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
