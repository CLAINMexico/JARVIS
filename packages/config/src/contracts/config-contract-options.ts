import type {
  ConfigObject
} from './config-contract-value.js';

/**
 * Opciones aceptadas para crear el módulo @jarvis/config.
 *
 * Este contrato permite crear configuración desde:
 * - Un objeto directo mediante values.
 * - Un archivo settings.json mediante file.
 *
 * Ambas opciones permiten alimentar ConfigService antes de que el módulo
 * quede disponible dentro del runtime de J.A.R.V.I.S.
 */
export interface ConfigModuleOptions {
  /**
   * Valores de configuración cargados directamente desde código.
   *
   * Esta opción es útil para pruebas, sandboxes o configuración
   * construida manualmente desde otro flujo, como @jarvis/bootstrap.
   */
  values?: ConfigObject;

  /**
   * Ruta hacia un archivo settings.json.
   *
   * Cuando se define esta opción, @jarvis/config lee el archivo durante
   * el arranque del módulo y carga su contenido dentro de ConfigService.
   *
   * Ejemplo:
   * apps/sandbox-api/settings.json
   */
  file?: string;
}
