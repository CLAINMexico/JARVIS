/**
 * Se importa como type porque solo se usa para describir
 * la forma de los valores de configuración.
 */
import type {
  ConfigObject
} from './config-value.js';

/**
 * Opciones aceptadas para crear el módulo @jarvis/config.
 *
 * Este contrato permite crear configuración desde:
 * - Un objeto directo.
 * - Un archivo settings.json.
 *
 * En esta primera versión, empezaremos usando values.
 * El soporte real para file se integrará después.
 */
export interface ConfigModuleOptions {
  /**
   * Valores de configuración cargados directamente desde código.
   *
   * Esta opción es útil para pruebas, sandboxes o configuración
   * construida manualmente.
   */
  values?: ConfigObject;

  /**
   * Ruta hacia un archivo settings.json.
   *
   * Esta opción queda preparada para cuando agreguemos lectura
   * de archivos desde @jarvis/config.
   *
   * Ejemplo:
   * apps/sandbox-api/settings.json
   */
  file?: string;
}
