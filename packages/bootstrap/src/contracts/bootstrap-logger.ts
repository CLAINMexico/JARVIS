import type {
  LoggerLevel
} from '@jarvis/logger';

/**
 * Configuración normalizada del logger.
 *
 * Esta estructura se entrega lista para crear @jarvis/logger.
 */
export interface BootstrapLogger {
  /**
   * Indica si el módulo logger está habilitado.
   */
  enabled: boolean;

  /**
   * Nombre normalizado de app para archivos de log.
   *
   * Ejemplo:
   * JARVIS_SANDBOXAPI
   */
  appName: string;

  /**
   * Nivel mínimo de log.
   */
  level: LoggerLevel;

  /**
   * Módulo por defecto para logs generados desde la app.
   */
  defaultModule: string;

  /**
   * Zona horaria usada por el logger.
   */
  timeZone: string;

  /**
   * Configuración de salida en consola.
   */
  console: {
    enabled: boolean;
    colors: boolean;
  };

  /**
   * Configuración de salida en archivo.
   */
  file: {
    enabled: boolean;
    path: string;
    splitByLevel: boolean;
    writeAll: boolean;
  };
}
