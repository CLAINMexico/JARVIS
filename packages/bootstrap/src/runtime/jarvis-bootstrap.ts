/**
 * Se importa ConfigService porque bootstrap debe entregar un servicio
 * de configuración listo para consultas después de cargar settings.json.
 *
 * Se importa loadConfigFile porque @jarvis/config es el package
 * responsable de leer y parsear archivos de configuración.
 */
import {
  ConfigService,
  loadConfigFile
} from '@jarvis/config';

/**
 * Se importa como type porque BootstrapOptions solo describe
 * las opciones recibidas por createJarvisBootstrap().
 */
import type {
  BootstrapOptions
} from '../contracts/bootstrap-options.js';

/**
 * Se importa como type porque BootstrapResult solo describe
 * la estructura final que devuelve el bootstrap.
 */
import type {
  BootstrapResult
} from '../contracts/bootstrap-result.js';

/**
 * Utilidades para convertir valores desconocidos de settings.json
 * a tipos seguros y normalizados.
 */
import {
  getBootstrapBoolean,
  getBootstrapEnvironment,
  getBootstrapLoggerLevel,
  getBootstrapNumber,
  getBootstrapString
} from '../utils/bootstrap-value-utils.js';

/**
 * Utilidades específicas para construir nombres relacionados con logger.
 */
import {
  buildBootstrapLoggerAppName,
  buildBootstrapLoggerDefaultModule
} from '../utils/bootstrap-logger-utils.js';

/**
 * Crea el bootstrap inicial de una aplicación J.A.R.V.I.S.
 *
 * Esta función se ejecuta antes de arrancar @jarvis/core.
 *
 * Responsabilidades:
 * - Leer settings.json usando @jarvis/config.
 * - Crear ConfigService.
 * - Normalizar configuración principal de app.
 * - Normalizar configuración principal de server.
 * - Normalizar configuración inicial de logger.
 *
 * Importante:
 * @jarvis/bootstrap no arranca el core, no inicia módulos y no ejecuta
 * lógica de negocio. Solo prepara valores para que la app pueda construir
 * su runtime de forma ordenada.
 */
export async function createJarvisBootstrap(
  options: BootstrapOptions
): Promise<BootstrapResult> {
  const settings = await loadConfigFile(options.settingsFile);
  const config = new ConfigService(settings);

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

  const serverHost = getBootstrapString(
    config.get('server.host'),
    '0.0.0.0'
  );

  const serverPort = getBootstrapNumber(
    config.get('server.port'),
    3000
  );

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

  const app = {
    name: appName,
    description: appDescription,
    version: appVersion,
    environment: appEnvironment,
    timeZone: appTimeZone,
    ...(appLicense.length > 0 ? { license: appLicense } : {})
  };

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
