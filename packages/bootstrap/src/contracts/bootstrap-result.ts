import type {
  ConfigObject,
  ConfigService
} from '@jarvis/config';

import type {
  BootstrapApp
} from './bootstrap-app.js';

import type {
  BootstrapLogger
} from './bootstrap-logger.js';

import type {
  BootstrapServer
} from './bootstrap-server.js';

/**
 * Resultado normalizado del bootstrap inicial.
 *
 * Este objeto contiene todo lo necesario para que una app pueda
 * construir sus módulos y arrancar @jarvis/core.
 */
export interface BootstrapResult {
  /**
   * Configuración completa cargada desde settings.json.
   */
  settings: ConfigObject;

  /**
   * Servicio de configuración listo para consultas.
   */
  config: ConfigService;

  /**
   * Configuración normalizada de la app.
   */
  app: BootstrapApp;

  /**
   * Configuración normalizada del servidor.
   */
  server: BootstrapServer;

  /**
   * Configuración normalizada del logger.
   */
  logger: BootstrapLogger;
}
