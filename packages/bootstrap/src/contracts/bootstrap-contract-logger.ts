import type {
  LoggerLevel
} from '@jarvis/logger';

/**
 * Representa la configuración normalizada del logger durante el bootstrap.
 *
 * Esta estructura se construye a partir de settings.json y se entrega lista
 * para crear el módulo real de @jarvis/logger mediante createLoggerModule().
 */
export interface BootstrapLogger {
  /**
   * Indica si el módulo logger está habilitado.
   *
   * Este valor funciona como switch maestro. Cuando es false, el servicio
   * logger puede seguir existiendo, pero no debe escribir en consola ni archivos.
   */
  enabled: boolean;

  /**
   * Nombre normalizado de la aplicación para impresión visual en logs.
   *
   * Este valor representa el bloque:
   *
   * [J.A.R.V.I.S. | App]
   *
   * dentro del formato homologado de consola y archivos.
   *
   * Ejemplo:
   * J.A.R.V.I.S. | Sandbox API
   */
  appName: string;

  /**
   * Nivel mínimo de log que será procesado por el logger.
   */
  level: LoggerLevel;

  /**
   * Nombre del paquete por defecto para logs generados desde la aplicación.
   *
   * Este valor representa el bloque [PACKAGE] dentro del formato homologado.
   *
   * Ejemplo:
   * Sandbox API
   */
  defaultPackage: string;

  /**
   * Nombre del módulo por defecto para logs generados desde la aplicación.
   *
   * Se conserva como contexto adicional y fallback para compatibilidad con
   * logs existentes.
   */
  defaultModule: string;

  /**
   * Zona horaria usada para formatear fechas y construir rutas de logs.
   */
  timeZone: string;

  /**
   * Configuración de salida de errores.
   */
  error: {
    /**
     * Indica si los errores deben imprimirse con información completa.
     *
     * true:
     * - Incluye stack trace cuando existe.
     *
     * false:
     * - Imprime información segura y resumida.
     */
    verbose: boolean;
  };

  /**
   * Configuración normalizada de transports del logger.
   *
   * Cada transport representa una salida disponible para los eventos.
   */
  transports: {
    /**
     * Configuración de salida en consola.
     */
    console: {
      /**
       * Indica si el logger puede escribir en consola.
       */
      enabled: boolean;

      /**
       * Indica si la salida en consola debe usar colores.
       */
      colors: boolean;
    };

    /**
     * Configuración de salida en archivos.
     */
    file: {
      /**
       * Indica si el logger puede escribir archivos de log.
       */
      enabled: boolean;

      /**
       * Ruta base donde se crearán los archivos de log.
       */
      path: string;

      /**
       * Indica si se deben crear archivos separados por nivel.
       */
      splitByLevel: boolean;

      /**
       * Indica si todos los logs deben escribirse también en un archivo general.
       */
      writeAll: boolean;
    };
  };
}
