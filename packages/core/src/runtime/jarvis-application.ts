/**
 * Se importa como type porque solo se usa para definir
 * la forma de la información que devuelve J.info().
 */
import type {
  JarvisInfo
} from '../contracts/jarvis-info.js';

/**
 * Se importa como type porque solo se usa para describir
 * los módulos ya normalizados dentro del runtime.
 */
import type {
  JarvisModuleInfo
} from '../contracts/jarvis-module.js';

/**
 * Se importan como type porque solo se usan para validar
 * la configuración recibida y el ambiente de ejecución.
 */
import type {
  JarvisEnvironment,
  JarvisOptions
} from '../contracts/jarvis-options.js';

/**
 * Configuración interna normalizada de J.A.R.V.I.S.
 *
 * A diferencia de JarvisOptions, aquí todos los valores opcionales
 * ya fueron resueltos con valores por defecto.
 *
 * Este tipo no se exporta porque solo lo usa internamente
 * JarvisApplication.
 */
interface NormalizedJarvisOptions {
  /**
   * Información principal de la aplicación ya normalizada.
   */
  app: {
    name: string;
    version: string;
    environment: JarvisEnvironment;
  };

  /**
   * Configuración del servidor ya normalizada.
   */
  server: {
    host: string;
    port: number;
  };

  /**
   * Lista de módulos registrados ya normalizados.
   */
  modules: JarvisModuleInfo[];
}

/**
 * Representa una instancia viva del runtime de J.A.R.V.I.S.
 *
 * Esta clase recibe las opciones de arranque, las normaliza
 * y expone métodos para consultar el estado actual del runtime.
 */
export class JarvisApplication {
  /**
   * Configuración interna del runtime.
   *
   * Es private porque nadie fuera de la clase debe modificarla
   * directamente.
   *
   * Es readonly porque la referencia principal de configuración
   * no debe reemplazarse después de construir la instancia.
   */
  private readonly options: NormalizedJarvisOptions;

  /**
   * Crea una nueva instancia de J.A.R.V.I.S.
   *
   * Recibe la configuración de entrada, aplica valores por defecto
   * y guarda una versión normalizada para uso interno.
   */
  public constructor(options: JarvisOptions) {
    this.options = {
      app: {
        name: options.app.name,
        version: options.app.version,
        environment: options.app.environment ?? 'local'
      },
      server: {
        host: options.server?.host ?? '0.0.0.0',
        port: options.server?.port ?? 3000
      },
      modules: (options.modules ?? []).map((module) => ({
        name: module.name,
        status: module.status ?? 'registered'
      }))
    };
  }

  /**
   * Devuelve información general de la instancia actual.
   *
   * Este método representa la respuesta pública de J.info().
   */
  public info(): JarvisInfo {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services',
      app: {
        name: this.options.app.name,
        version: this.options.app.version,
        environment: this.options.app.environment
      },
      server: {
        host: this.options.server.host,
        port: this.options.server.port
      },
      modules: this.modules(),
      status: 'bootstrapped'
    };
  }

  /**
   * Devuelve los módulos registrados en el runtime.
   *
   * Se devuelve una copia del arreglo para evitar que código externo
   * modifique directamente la lista interna de módulos.
   */
  public modules(): JarvisModuleInfo[] {
    return [...this.options.modules];
  }
}
