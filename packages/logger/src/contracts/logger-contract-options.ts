import type {
  LoggerLevel
} from './logger-contract-level.js';

/**
 * Opciones disponibles para configurar @jarvis/logger.
 *
 * Estas opciones permiten controlar el estado general del logger, el nivel
 * mínimo de escritura, el paquete por defecto, el módulo por defecto, la zona
 * horaria, la salida de errores y los transports disponibles.
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
   * Nombre de la aplicación usado para impresión visual en logs.
   *
   * Ejemplo:
   * J.A.R.V.I.S. | Sandbox API
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
   * Paquete por defecto usado cuando el log no recibe uno explícito.
   *
   * Este valor se imprime como el bloque [PACKAGE] dentro del formato
   * homologado.
   *
   * Ejemplo:
   * @jarvis/logger
   */
  defaultPackage?: string;

  /**
   * Módulo por defecto usado cuando el log no recibe uno explícito.
   *
   * Se conserva como contexto interno y fallback para mantener compatibilidad
   * con logs existentes.
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
   * Configuración de serialización de errores.
   *
   * verbose controla si los errores se imprimen con stack trace completo o
   * solo con información segura y resumida.
   */
  error?: {
    /**
     * Cuando es true, los errores se imprimen con información completa,
     * incluyendo stack trace cuando exista.
     *
     * Cuando es false, los errores se imprimen con información segura:
     * name, message y code cuando exista.
     */
    verbose?: boolean;
  };

  /**
   * Configuración de transports del logger.
   *
   * Cada transport representa una salida disponible para los eventos de log.
   *
   * Ejemplos:
   * - console: salida en consola.
   * - file: salida en archivos.
   *
   * Esta estructura permite agregar nuevos transports en el futuro sin crecer
   * propiedades directas en la raíz de LoggerOptions.
   */
  transports?: {
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
     *
     * La estructura interna de archivos no es configurable. @jarvis/logger usa
     * una estructura estándar:
     *
     * logs/YYYY/MM/DD/all.log
     * logs/YYYY/MM/DD/debug.log
     * logs/YYYY/MM/DD/info.log
     * logs/YYYY/MM/DD/warn.log
     * logs/YYYY/MM/DD/error.log
     * logs/YYYY/MM/DD/fatal.log
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
       * Indica si todos los logs deben escribirse también en un archivo all.log.
       */
      writeAll?: boolean;
    };
  };
}
