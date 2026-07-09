/**
 * Contratos públicos de valores de configuración.
 *
 * Estos types describen los valores primitivos, objetos y estructuras
 * permitidas dentro de la configuración de J.A.R.V.I.S.
 */
export type {
  ConfigObject,
  ConfigPrimitiveValue,
  ConfigValue
} from './contracts/config-contract-value.js';

/**
 * Contratos públicos del módulo de configuración.
 *
 * Estos types describen las opciones disponibles para crear y registrar
 * el módulo de configuración dentro del runtime.
 */
export type {
  ConfigModuleOptions
} from './contracts/config-contract-options.js';

/**
 * Servicio principal de Config.
 *
 * ConfigService permite cargar, consultar y exponer valores de configuración
 * mediante paths separados por punto.
 *
 * Ejemplo:
 *
 * config.get('app.name')
 */
export {
  ConfigService
} from './runtime/config-runtime-service.js';

/**
 * Módulo vivo de Config.
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
 * Utilidad pública para carga de archivos de configuración.
 *
 * loadConfigFile() permite leer, parsear y validar archivos JSON de
 * configuración sin duplicar lógica en paquetes superiores.
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
