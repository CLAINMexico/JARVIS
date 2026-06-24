/**
 * Se importa como type porque solo se usa para describir
 * los valores internos de configuración.
 */
import type {
  ConfigObject,
  ConfigValue
} from '../contracts/config-value.js';

/**
 * Servicio principal de configuración de J.A.R.V.I.S.
 *
 * Esta clase almacena los valores de configuración y permite
 * consultarlos mediante paths separados por punto.
 *
 * Ejemplo:
 * config.get('app.name')
 * config.get('server.port')
 * config.get('database.connections.main.driver')
 */
export class ConfigService {
  /**
   * Valores internos de configuración.
   *
   * Se mantienen privados para evitar modificaciones directas
   * desde fuera del servicio.
   */
  private values: ConfigObject;

  /**
   * Crea una nueva instancia del servicio de configuración.
   *
   * Recibe un objeto de configuración y lo guarda internamente.
   */
  public constructor(values: ConfigObject = {}) {
    this.values = values;
  }

  /**
   * Carga nuevos valores dentro del servicio de configuración.
   *
   * Este método reemplaza la configuración interna actual por
   * los valores recibidos.
   */
  public load(values: ConfigObject): void {
    this.values = values;
  }

  /**
   * Devuelve un valor de configuración usando un path separado por puntos.
   *
   * Si el path no existe, devuelve undefined.
   *
   * Ejemplo:
   * get('app.name')
   */
  public get(path: string): ConfigValue | undefined {
    const keys = path.split('.');
    let current: ConfigValue | undefined = this.values;
    for (const key of keys) {
      if (!this.isConfigObject(current)) {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }

  /**
   * Devuelve todos los valores de configuración.
   *
   * Se devuelve una copia superficial para evitar que código externo
   * reemplace directamente la referencia principal.
   */
  public all(): ConfigObject {
    return { ...this.values };
  }

  /**
   * Verifica si un valor es un objeto de configuración.
   *
   * Esto evita intentar leer propiedades sobre strings, numbers,
   * booleans, null o arreglos.
   */
  private isConfigObject(value: ConfigValue | undefined): value is ConfigObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
