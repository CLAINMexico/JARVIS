/**
 * Se importa como type porque solo se usa para cumplir
 * el contrato de módulo vivo definido por @jarvis/core.
 */
import type {
  JarvisRuntimeModule
} from '@jarvis/core';

/**
 * Se importa como type porque solo se usa para describir
 * las opciones aceptadas por el módulo de configuración.
 */
import type {
  ConfigModuleOptions
} from '../contracts/config-options.js';

/**
 * Servicio principal de configuración.
 */
import {
  ConfigService
} from './config-service.js';

/**
 * Loader encargado de leer settings.json desde disco.
 */
import {
  loadConfigFile
} from './config-file-loader.js';

/**
 * Módulo vivo de configuración para J.A.R.V.I.S.
 *
 * Este módulo cumple con JarvisRuntimeModule, por lo que puede ser
 * registrado, arrancado y apagado por @jarvis/core.
 */
export interface ConfigModule extends JarvisRuntimeModule {
  /**
   * Servicio público expuesto por el módulo.
   *
   * Permite consultar valores de configuración cargados por @jarvis/config.
   */
  service: ConfigService;
}

/**
 * Crea una instancia del módulo @jarvis/config.
 *
 * El módulo puede iniciar con valores directos mediante values
 * y también cargar configuración desde un archivo settings.json
 * durante boot().
 */
export function createConfigModule(options: ConfigModuleOptions = {}): ConfigModule {
  const service = new ConfigService(options.values ?? {});
  return {
    name: 'config',
    service,
    async boot() {
      if (options.file) {
        const values = await loadConfigFile(options.file);
        service.load(values);
      }
    },
    shutdown() {
    }
  };
}
