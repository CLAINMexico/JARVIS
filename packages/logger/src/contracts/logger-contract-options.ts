import type {
  LoggerLevel
} from './logger-contract-level.js';

/**
 * Opciones disponibles para configurar @jarvis/logger.
 *
 * Estas opciones permiten controlar el estado general del logger, el nivel
 * mínimo de escritura, el módulo por defecto, la zona horaria y los transports
 * disponibles.
 */
export interface LoggerOptions {
  /**
   * Habilita o deshabilita el logger completo.
   *
   * Este valor funciona como switch maestro del módulo.
   *
   * Cuando enabled es false:
   * - El servicio logger sigue existiendo.
   * - No se escribe en consola.
   * - No se escriben archivos.
   * - No se imprimen mensajes internos de boot/shutdown.
   *
   * Esto permite que otros paquetes puedan seguir usando core.service('logger')
   * sin romper el flujo, incluso cuando el logger esté apagado.
   */
  enabled?: boolean;

  /**
   * Nombre de la aplicación usado para construir nombres de archivos de log.
   *
   * Ejemplo:
   * JARVIS_APPNAME
   */
  appName?: string;

  /**
   * Nivel mínimo que será procesado por el logger.
   *
   * Los eventos con menor prioridad serán ignorados.
   *
   * Ejemplo:
   * Si level es info, los logs debug no se procesan.
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
   *
   * Este bloque solo controla el transport de consola. Si enabled está en false,
   * el logger completo permanecerá apagado aunque console.enabled sea true.
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
   *
   * Este bloque solo controla el transport de archivos. Si enabled está en false,
   * el logger completo permanecerá apagado aunque file.enabled sea true.
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
     * Indica si se deben crear archivos separados por nivel.
     */
    splitByLevel?: boolean;

    /**
     * Indica si todos los logs deben escribirse también en un archivo ALL.
     */
    writeAll?: boolean;
  };
}
