import {
  JarvisApplication
} from './runtime/core-runtime-application.js';

import type {
  JarvisInfo
} from './contracts/core-contract-info.js';

import type {
  JarvisOptions
} from './contracts/core-contract-options.js';

/**
 * Contratos públicos de información del runtime.
 *
 * Estos types describen la información que una instancia viva de J.A.R.V.I.S.
 * puede reportar mediante core.info().
 */
export type {
  JarvisAppInfo,
  JarvisInfo,
  JarvisServerInfo
} from './contracts/core-contract-info.js';

/**
 * Contratos públicos de módulos informativos.
 *
 * Estos types definen cómo se describen, registran y reportan los módulos
 * dentro del runtime de J.A.R.V.I.S.
 */
export type {
  JarvisModuleInfo,
  JarvisModuleOptions,
  JarvisModuleStatus
} from './contracts/core-contract-module.js';

/**
 * Contrato público para módulos vivos del runtime.
 *
 * Este type define el comportamiento que puede tener un módulo dentro del
 * ciclo de vida de J.A.R.V.I.S., incluyendo boot(), shutdown() y service.
 */
export type {
  JarvisRuntimeModule
} from './contracts/core-contract-runtime-module.js';

/**
 * Contratos públicos de configuración de arranque.
 *
 * Estos types definen la configuración aceptada por Jarvis.boot() para crear
 * una nueva instancia del runtime.
 */
export type {
  JarvisAppOptions,
  JarvisEnvironment,
  JarvisOptions,
  JarvisServerHttpsOptions,
  JarvisServerOptions,
  JarvisServerProtocol
} from './contracts/core-contract-options.js';

/**
 * Runtime principal de Core.
 *
 * JarvisApplication representa una instancia viva del runtime de J.A.R.V.I.S.
 * Se exporta para usos avanzados. La forma recomendada de crear una instancia
 * es mediante Jarvis.boot().
 */
export {
  JarvisApplication
} from './runtime/core-runtime-application.js';

/**
 * Punto de entrada principal de @jarvis/core.
 *
 * Jarvis expone la API pública para arrancar e inspeccionar el runtime base
 * del ecosistema J.A.R.V.I.S.
 */
export class Jarvis {
  /**
   * Arranca una nueva instancia del runtime de J.A.R.V.I.S.
   *
   * Recibe las opciones iniciales, crea una instancia de JarvisApplication
   * y la devuelve lista para ejecutar su ciclo de vida.
   */
  public static async boot(options: JarvisOptions): Promise<JarvisApplication> {
    const app = new JarvisApplication(options);

    return app;
  }

  /**
   * Devuelve información estática sobre @jarvis/core.
   *
   * Este método no necesita que exista una instancia viva del runtime.
   */
  public static about(): Pick<JarvisInfo, 'name' | 'description'> {
    return {
      name: '@jarvis/core',
      description: 'J.A.R.V.I.S. | Package - Core'
    };
  }
}
