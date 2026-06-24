/**
 * Entrada pública del package @jarvis/config.
 *
 * Este package permite crear un módulo vivo de configuración
 * compatible con el runtime de J.A.R.V.I.S.
 */

/**
 * Contratos públicos de valores de configuración.
 *
 * Estos tipos describen qué valores puede almacenar y exponer
 * el servicio de configuración.
 */
export type {
  ConfigObject,
  ConfigPrimitiveValue,
  ConfigValue
} from './contracts/config-value.js';

/**
 * Contratos públicos de opciones del módulo de configuración.
 *
 * Estos tipos definen cómo se puede crear una instancia de
 * @jarvis/config.
 */
export type {
  ConfigModuleOptions
} from './contracts/config-options.js';

/**
 * Servicio principal de configuración.
 *
 * Permite consultar valores mediante paths como:
 * config.get('app.name')
 */
export {
  ConfigService
} from './runtime/config-service.js';

/**
 * Módulo vivo de configuración.
 *
 * createConfigModule() crea un módulo compatible con JarvisRuntimeModule
 * para que @jarvis/core pueda registrarlo, arrancarlo y apagarlo.
 */
export type {
  ConfigModule
} from './runtime/config-module.js';

export {
  createConfigModule
} from './runtime/config-module.js';

/**
 * Información estática del package.
 *
 * Se usa solo como referencia interna o para pruebas rápidas.
 */
export const JarvisConfigPackage = {
  name: '@jarvis/config',
  description: 'J.A.R.V.I.S. | Package - Config',
  version: '0.7.0'
} as const;
