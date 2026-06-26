import type {
  ConfigObject,
  ConfigValue
} from '../contracts/config-contract-value.js';

/**
 * Servicio principal de configuración de J.A.R.V.I.S.
 *
 * Esta clase almacena valores de configuración y permite consultarlos
 * mediante paths separados por punto.
 *
 * Ejemplos:
 * - config.get('app.name')
 * - config.get('server.port')
 * - config.get('database.connections.main.driver')
 */
export class ConfigService {
  /**
   * Valores internos de configuración.
   *
   * Se mantienen privados para evitar que código externo reemplace
   * directamente la referencia principal del servicio.
   */
  private values: ConfigObject;

  /**
   * Crea una nueva instancia del servicio de configuración.
   *
   * Recibe un objeto de configuración inicial y lo guarda internamente.
   */
  public constructor(values: ConfigObject = {}) {
    this.values = values;
  }

  /**
   * Carga nuevos valores dentro del servicio de configuración.
   *
   * Este método reemplaza la configuración interna actual por los valores
   * recibidos.
   */
  public load(values: ConfigObject): void {
    this.values = values;
  }

  /**
   * Devuelve un valor de configuración usando un path separado por puntos.
   *
   * Si el path no existe o el recorrido intenta continuar sobre un valor
   * que no es objeto, devuelve undefined.
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
   *
   * Nota:
   * Los objetos anidados conservan sus referencias internas. Si se necesita
   * aislamiento completo, deberá implementarse una copia profunda.
   */
  public all(): ConfigObject {
    return { ...this.values };
  }

  /**
   * Verifica si un valor puede tratarse como objeto de configuración.
   *
   * Esto evita intentar leer propiedades sobre strings, numbers, booleans,
   * null o arreglos durante la lectura por path.
   */
  private isConfigObject(value: ConfigValue | undefined): value is ConfigObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
