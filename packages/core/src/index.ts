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
 * Estos types describen la información que puede reportar una instancia viva
 * de J.A.R.V.I.S. mediante core.info().
 */
export type {
  JarvisInfo
} from './contracts/core-contract-info.js';

/**
 * Contratos públicos de módulos informativos.
 *
 * Estos types definen cómo se registran y reportan los módulos dentro
 * del runtime de J.A.R.V.I.S.
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
 * ciclo de vida de J.A.R.V.I.S., como boot(), shutdown() y service.
 */
export type {
  JarvisRuntimeModule
} from './contracts/core-contract-runtime-module.js';

/**
 * Contratos públicos de configuración de arranque.
 *
 * Estos types definen la configuración aceptada por Jarvis.boot().
 */
export type {
  JarvisAppOptions,
  JarvisEnvironment,
  JarvisOptions,
  JarvisServerOptions
} from './contracts/core-contract-options.js';

/**
 * Clase principal de aplicación del runtime.
 *
 * Se exporta para usos avanzados. La forma recomendada de crear una instancia
 * es usando Jarvis.boot().
 */
export {
  JarvisApplication
} from './runtime/core-runtime-application.js';

/**
 * Punto de entrada principal del paquete @jarvis/core.
 *
 * Esta clase expone la API pública para arrancar e inspeccionar el runtime
 * de J.A.R.V.I.S.
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
   * Devuelve información estática sobre J.A.R.V.I.S.
   *
   * Este método no necesita que exista una instancia arrancada del runtime.
   */
  public static about(): Pick<JarvisInfo, 'name' | 'description'> {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services'
    };
  }
}
