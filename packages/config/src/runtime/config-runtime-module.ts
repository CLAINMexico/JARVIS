import type {
  JarvisRuntimeModule
} from '@jarvis/core';

import type {
  ConfigModuleOptions
} from '../contracts/config-contract-options.js';

import {
  ConfigService
} from './config-runtime-service.js';

import {
  loadConfigFile
} from './config-runtime-file-loader.js';

/**
 * Módulo vivo de configuración para J.A.R.V.I.S.
 *
 * Este módulo cumple con el contrato JarvisRuntimeModule, por lo que puede
 * ser registrado, arrancado y apagado por @jarvis/core.
 *
 * Expone ConfigService como servicio público para que la aplicación pueda
 * consultar valores de configuración desde el runtime.
 */
export interface ConfigModule extends JarvisRuntimeModule {
  /**
   * Servicio público expuesto por el módulo.
   *
   * Permite consultar valores cargados desde un objeto directo o desde
   * un archivo settings.json.
   */
  service: ConfigService;
}

/**
 * Crea una instancia del módulo @jarvis/config.
 *
 * El módulo puede recibir configuración inicial mediante values y también
 * puede cargar configuración desde un archivo settings.json durante boot().
 *
 * Flujo esperado:
 * - Si se reciben values, ConfigService inicia con esos valores.
 * - Si se recibe file, el archivo se lee durante boot().
 * - Después de boot(), el servicio queda listo para consulta.
 */
export function createConfigModule(options: ConfigModuleOptions = {}): ConfigModule {
  const service = new ConfigService(options.values ?? {});

  return {
    name: 'config',
    service,

    /**
     * Carga configuración desde archivo cuando se define options.file.
     *
     * Esta lectura ocurre durante el ciclo de vida del runtime, permitiendo
     * que @jarvis/core controle cuándo queda listo el módulo.
     */
    async boot() {
      if (options.file) {
        const values = await loadConfigFile(options.file);

        service.load(values);
      }
    },

    /**
     * Mantiene compatibilidad con el ciclo de vida del runtime.
     *
     * Actualmente @jarvis/config no conserva conexiones ni recursos externos
     * que deban liberarse durante el apagado.
     */
    shutdown() {
    }
  };
}
