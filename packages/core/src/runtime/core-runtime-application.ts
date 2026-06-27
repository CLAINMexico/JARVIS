import type {
  JarvisInfo
} from '../contracts/core-contract-info.js';

import type {
  JarvisModuleInfo
} from '../contracts/core-contract-module.js';

import type {
  JarvisRuntimeModule
} from '../contracts/core-contract-runtime-module.js';

import type {
  JarvisEnvironment,
  JarvisOptions,
  JarvisServerHttpsOptions,
  JarvisServerProtocol
} from '../contracts/core-contract-options.js';

/**
 * Configuración interna normalizada de J.A.R.V.I.S.
 *
 * A diferencia de JarvisOptions, aquí todos los valores opcionales ya fueron
 * resueltos con valores por defecto.
 *
 * Este tipo no se exporta porque solo lo usa internamente JarvisApplication.
 */
interface NormalizedJarvisOptions {
  /**
   * Información principal de la aplicación ya normalizada.
   */
  app: {
    name: string;
    description: string;
    version: string;
    environment: JarvisEnvironment;
  };

  /**
   * Configuración del servidor ya normalizada.
   *
   * Esta información no crea servidores por sí misma. Solo describe la
   * configuración que una aplicación HTTP puede usar para arrancar su capa
   * de transporte.
   */
  server: {
    host: string;
    port: number;
    protocol: JarvisServerProtocol;
    https: JarvisServerHttpsOptions;
  };

  /**
   * Lista de módulos registrados ya normalizados.
   */
  modules: JarvisModuleInfo[];

  /**
   * Lista de módulos vivos registrados en el runtime.
   *
   * Estos módulos pueden tener comportamiento de ciclo de vida mediante
   * boot() y shutdown().
   */
  runtimeModules: JarvisRuntimeModule[];
}

/**
 * Normaliza la configuración HTTPS del servidor.
 *
 * El core no lee certificados ni valida su existencia en disco. Solo conserva
 * la configuración recibida y asegura una estructura estable para core.info().
 *
 * keyFile y certFile solo se agregan cuando tienen valor real para evitar
 * propiedades opcionales con valor undefined.
 */
function normalizeServerHttpsOptions(
  options: JarvisOptions
): JarvisServerHttpsOptions {
  const https = options.server?.https;

  if (!https) {
    return {
      enabled: false
    };
  }

  return {
    enabled: https.enabled,
    ...(https.keyFile ? { keyFile: https.keyFile } : {}),
    ...(https.certFile ? { certFile: https.certFile } : {})
  };
}

/**
 * Normaliza el protocolo configurado para el servidor.
 *
 * Si no se recibe un protocolo válido, J.A.R.V.I.S. usa http por defecto.
 */
function normalizeServerProtocol(
  options: JarvisOptions
): JarvisServerProtocol {
  return options.server?.protocol ?? 'http';
}

/**
 * Representa una instancia viva del runtime de J.A.R.V.I.S.
 *
 * Esta clase recibe las opciones de arranque, las normaliza y expone métodos
 * para consultar información, acceder a servicios registrados y ejecutar el
 * ciclo de vida de los módulos vivos.
 */
export class JarvisApplication {
  /**
   * Configuración interna del runtime.
   *
   * Es private porque nadie fuera de la clase debe modificarla directamente.
   * Es readonly porque la referencia principal de configuración no debe
   * reemplazarse después de construir la instancia.
   */
  private readonly options: NormalizedJarvisOptions;

  /**
   * Registro interno de servicios expuestos por módulos vivos.
   *
   * La llave corresponde al nombre del módulo y el valor corresponde al
   * servicio que ese módulo expone.
   */
  private readonly services = new Map<string, unknown>();

  /**
   * Crea una nueva instancia de J.A.R.V.I.S.
   *
   * Recibe la configuración de entrada, aplica valores por defecto y guarda
   * una versión normalizada para uso interno.
   *
   * También registra los servicios expuestos por módulos vivos usando el
   * nombre del módulo como llave.
   */
  public constructor(options: JarvisOptions) {
    const runtimeModules = options.runtimeModules ?? [];

    this.options = {
      app: {
        name: options.app.name,
        description: options.app.description,
        version: options.app.version,
        environment: options.app.environment ?? 'local'
      },
      server: {
        host: options.server?.host ?? '0.0.0.0',
        port: options.server?.port ?? 3000,
        protocol: normalizeServerProtocol(options),
        https: normalizeServerHttpsOptions(options)
      },
      modules: [
        ...(options.modules ?? []).map((module) => ({
          name: module.name,
          status: module.status ?? 'registered'
        })),
        ...runtimeModules.map((module) => ({
          name: module.name,
          status: 'registered' as const
        }))
      ],
      runtimeModules
    };

    for (const module of runtimeModules) {
      if (module.service !== undefined) {
        this.services.set(module.name, module.service);
      }
    }
  }

  /**
   * Ejecuta el método boot() de todos los módulos vivos que lo tengan.
   *
   * Los módulos se arrancan en el orden en el que fueron registrados.
   */
  public async bootModules(): Promise<void> {
    for (const module of this.options.runtimeModules) {
      await module.boot?.();
    }
  }

  /**
   * Ejecuta el método shutdown() de todos los módulos vivos que lo tengan.
   *
   * Los módulos se apagan en orden inverso al arranque para respetar
   * dependencias simples entre ellos.
   */
  public async shutdown(): Promise<void> {
    for (const module of [...this.options.runtimeModules].reverse()) {
      await module.shutdown?.();
    }
  }

  /**
   * Devuelve información general de la instancia actual.
   *
   * Este método representa la respuesta pública de core.info().
   */
  public info(): JarvisInfo {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services',
      app: {
        name: this.options.app.name,
        description: this.options.app.description,
        version: this.options.app.version,
        environment: this.options.app.environment
      },
      server: {
        host: this.options.server.host,
        port: this.options.server.port,
        protocol: this.options.server.protocol,
        https: this.options.server.https
      },
      modules: this.modules(),
      status: 'bootstrapped'
    };
  }

  /**
   * Devuelve los módulos registrados en el runtime.
   *
   * Se devuelve una copia superficial del arreglo para evitar que código
   * externo modifique directamente la lista interna de módulos.
   */
  public modules(): JarvisModuleInfo[] {
    return [...this.options.modules];
  }

  /**
   * Obtiene un servicio registrado dentro del runtime.
   *
   * El nombre recibido debe coincidir con el nombre del módulo vivo que
   * expuso el servicio.
   */
  public service<TService = unknown>(name: string): TService | undefined {
    return this.services.get(name) as TService | undefined;
  }
}
