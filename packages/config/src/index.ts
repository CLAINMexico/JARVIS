/**
 * Contratos públicos de @jarvis/config.
 *
 * Estos types describen los valores permitidos dentro de la configuración
 * y las opciones disponibles para crear el módulo de configuración.
 */
export type {
  ConfigObject,
  ConfigPrimitiveValue,
  ConfigValue
} from './contracts/config-contract-value.js';

export type {
  ConfigModuleOptions
} from './contracts/config-contract-options.js';

/**
 * Servicio principal de configuración.
 *
 * Permite cargar, consultar y exponer valores de configuración mediante
 * paths separados por punto.
 *
 * Ejemplo:
 * config.get('app.name')
 */
export {
  ConfigService
} from './runtime/config-runtime-service.js';

/**
 * Módulo vivo de configuración.
 *
 * ConfigModule describe el módulo compatible con JarvisRuntimeModule.
 * createConfigModule() crea una instancia lista para ser registrada,
 * arrancada y apagada por @jarvis/core.
 */
export type {
  ConfigModule
} from './runtime/config-runtime-module.js';

export {
  createConfigModule
} from './runtime/config-runtime-module.js';

/**
 * Utilidad pública para cargar archivos de configuración.
 *
 * Se exporta para que paquetes superiores, como @jarvis/bootstrap,
 * puedan leer settings.json sin duplicar lógica de lectura, parseo
 * y validación.
 */
export {
  loadConfigFile
} from './runtime/config-runtime-file-loader.js';

/**
 * Información pública del package @jarvis/config.
 *
 * Este objeto permite identificar el package desde pruebas, diagnósticos
 * o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisConfigPackage = {
  name: '@jarvis/config',
  description: 'J.A.R.V.I.S. | Package - Config'
} as const;
