/**
 * Clase principal que representa una instancia viva del runtime.
 *
 * Se importa aquí para poder usarla como tipo de retorno en Jarvis.boot()
 * y también para exportarla desde la entrada pública del paquete.
 */
import {
  JarvisApplication
} from './runtime/jarvis-application.js';

/**
 * Contrato de información reportada por una instancia de J.A.R.V.I.S.
 *
 * Se usa en Jarvis.about() para indicar que solo devolveremos
 * el nombre y la descripción del runtime.
 */
import type {
  JarvisInfo
} from './contracts/jarvis-info.js';

/**
 * Contrato de configuración aceptada al arrancar J.A.R.V.I.S.
 *
 * Se usa como parámetro principal de Jarvis.boot().
 */
import type {
  JarvisOptions
} from './contracts/jarvis-options.js';

/**
 * Contratos públicos de información del runtime.
 *
 * Estos tipos describen la información que puede reportar
 * una instancia viva de J.A.R.V.I.S.
 */
export type {
  JarvisInfo
} from './contracts/jarvis-info.js';

/**
 * Contratos públicos de módulos.
 *
 * Estos tipos definen cómo se registran y reportan los módulos
 * dentro del runtime de J.A.R.V.I.S.
 */
export type {
  JarvisModuleInfo,
  JarvisModuleOptions,
  JarvisModuleStatus
} from './contracts/jarvis-module.js';

/**
 * Contratos públicos de configuración de arranque.
 *
 * Estos tipos definen la configuración aceptada por Jarvis.boot().
 */
export type {
  JarvisAppOptions,
  JarvisEnvironment,
  JarvisOptions,
  JarvisServerOptions
} from './contracts/jarvis-options.js';

/**
 * Instancia de aplicación del runtime.
 *
 * Se exporta para usos avanzados. La forma recomendada de crear
 * una instancia es usando Jarvis.boot().
 */
export {
  JarvisApplication
} from './runtime/jarvis-application.js';

/**
 * Punto de entrada principal del paquete @jarvis/core.
 *
 * Esta clase expone la API pública para arrancar e inspeccionar
 * el runtime de J.A.R.V.I.S.
 */
export class Jarvis {
  /**
   * Arranca una nueva instancia del runtime de J.A.R.V.I.S.
   *
   * Recibe las opciones iniciales, crea una instancia de
   * JarvisApplication y la devuelve lista para usarse.
   */
  public static async boot(options: JarvisOptions): Promise<JarvisApplication> {
    const app = new JarvisApplication(options);
    return app;
  }

  /**
   * Devuelve información estática sobre J.A.R.V.I.S.
   *
   * Este método no necesita que exista una instancia arrancada
   * del runtime.
   */
  public static about(): Pick<JarvisInfo, 'name' | 'description'> {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services'
    };
  }
}
