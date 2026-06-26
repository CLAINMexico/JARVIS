import {
  ConfigService,
  loadConfigFile
} from '@jarvis/config';

import type {
  BootstrapOptions
} from '../contracts/bootstrap-contract-options.js';

import type {
  BootstrapResult
} from '../contracts/bootstrap-contract-result.js';

import {
  getBootstrapBoolean,
  getBootstrapEnvironment,
  getBootstrapLoggerLevel,
  getBootstrapNumber,
  getBootstrapString
} from '../utils/bootstrap-util-value.js';

import {
  buildBootstrapLoggerAppName,
  buildBootstrapLoggerDefaultModule
} from '../utils/bootstrap-util-logger.js';

/**
 * Crea el bootstrap inicial de una aplicación J.A.R.V.I.S.
 *
 * Esta función se ejecuta antes de arrancar @jarvis/core y prepara
 * los valores base que una aplicación necesita para construir su runtime.
 *
 * Responsabilidades:
 * - Leer settings.json usando @jarvis/config.
 * - Crear una instancia inicial de ConfigService.
 * - Normalizar datos principales de la aplicación.
 * - Normalizar datos principales del servidor.
 * - Normalizar configuración inicial para @jarvis/logger.
 *
 * Importante:
 * @jarvis/bootstrap no arranca el core, no inicia módulos y no ejecuta
 * lógica de negocio. Solo prepara valores para que la aplicación pueda
 * construir su runtime de forma ordenada.
 */
export async function createJarvisBootstrap(
  options: BootstrapOptions
): Promise<BootstrapResult> {
  /**
   * Se carga el archivo de configuración base y se crea un ConfigService
   * temporal para consultar valores mediante paths.
   *
   * Este ConfigService forma parte del resultado del bootstrap, pero todavía
   * no representa un módulo vivo registrado dentro de @jarvis/core.
   */
  const settings = await loadConfigFile(options.settingsFile);
  const config = new ConfigService(settings);

  /**
   * Normalización de datos principales de la aplicación.
   *
   * Estos valores se entregan posteriormente a Jarvis.boot().
   */
  const appName = getBootstrapString(
    config.get('app.name'),
    'J.A.R.V.I.S. | App'
  );

  const appDescription = getBootstrapString(
    config.get('app.description'),
    'J.A.R.V.I.S. | Application'
  );

  const appVersion = getBootstrapString(
    config.get('app.version'),
    '0.0.0'
  );

  const appEnvironment = getBootstrapEnvironment(
    config.get('app.environment')
  );

  const appLicense = getBootstrapString(
    config.get('app.license'),
    ''
  );

  const appTimeZone = getBootstrapString(
    config.get('app.timeZone'),
    'UTC'
  );

  /**
   * Normalización de datos principales del servidor.
   *
   * Estos valores definen la configuración base que el runtime conoce
   * sobre la aplicación backend.
   */
  const serverHost = getBootstrapString(
    config.get('server.host'),
    '0.0.0.0'
  );

  const serverPort = getBootstrapNumber(
    config.get('server.port'),
    3000
  );

  /**
   * Normalización de configuración para @jarvis/logger.
   *
   * El bootstrap no crea el logger directamente. Solo prepara la estructura
   * que después se entregará a createLoggerModule().
   */
  const loggerEnabled = getBootstrapBoolean(
    config.get('modules.logger.enabled'),
    true
  );

  const loggerLevel = getBootstrapLoggerLevel(
    config.get('modules.logger.level')
  );

  const loggerConsoleEnabled = getBootstrapBoolean(
    config.get('modules.logger.console.enabled'),
    true
  );

  const loggerConsoleColors = getBootstrapBoolean(
    config.get('modules.logger.console.colors'),
    true
  );

  const loggerFileEnabled = getBootstrapBoolean(
    config.get('modules.logger.file.enabled'),
    false
  );

  const loggerFilePath = getBootstrapString(
    config.get('modules.logger.file.path'),
    './logs'
  );

  const loggerFileSplitByLevel = getBootstrapBoolean(
    config.get('modules.logger.file.splitByLevel'),
    true
  );

  const loggerFileWriteAll = getBootstrapBoolean(
    config.get('modules.logger.file.writeAll'),
    true
  );

  /**
   * Construye la configuración final de la aplicación.
   *
   * La licencia solo se agrega cuando existe un valor real para evitar
   * enviar license: undefined cuando exactOptionalPropertyTypes está activo.
   */
  const app = {
    name: appName,
    description: appDescription,
    version: appVersion,
    environment: appEnvironment,
    timeZone: appTimeZone,
    ...(appLicense.length > 0 ? { license: appLicense } : {})
  };

  /**
   * Devuelve el resultado completo del bootstrap.
   *
   * Este objeto permite que la aplicación cree módulos reales y después
   * arranque @jarvis/core sin que el core tenga que leer archivos ni conocer
   * detalles específicos de configuración.
   */
  return {
    settings,
    config,
    app,
    server: {
      host: serverHost,
      port: serverPort
    },
    logger: {
      enabled: loggerEnabled,
      appName: buildBootstrapLoggerAppName(appName),
      level: loggerLevel,
      defaultModule: buildBootstrapLoggerDefaultModule(appName),
      timeZone: appTimeZone,
      console: {
        enabled: loggerConsoleEnabled,
        colors: loggerConsoleColors
      },
      file: {
        enabled: loggerFileEnabled,
        path: loggerFilePath,
        splitByLevel: loggerFileSplitByLevel,
        writeAll: loggerFileWriteAll
      }
    }
  };
}
