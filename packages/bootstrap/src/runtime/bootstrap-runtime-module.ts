import type {
  JarvisServerProtocol
} from '@jarvis/core';

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
 * Resuelve el protocolo configurado para el servidor.
 *
 * Cualquier valor distinto de https se interpreta como http para conservar
 * compatibilidad con configuraciones previas.
 */
function resolveBootstrapServerProtocol(value: unknown): JarvisServerProtocol {
  const protocol = getBootstrapString(
    value,
    'http'
  );

  if (protocol === 'https') {
    return 'https';
  }

  return 'http';
}

/**
 * Valida la configuración HTTP/HTTPS del servidor.
 *
 * Esta validación se realiza durante el bootstrap para detectar errores de
 * configuración antes de arrancar @jarvis/core o crear el servidor HTTP.
 */
function validateBootstrapServerOptions(
  protocol: JarvisServerProtocol,
  httpsEnabled: boolean,
  httpsKeyFile: string,
  httpsCertFile: string
): void {
  if (protocol === 'https' && !httpsEnabled) {
    throw new Error('J.A.R.V.I.S. Bootstrap | server.protocol está configurado como https, pero server.https.enabled no está activo.');
  }

  if (protocol === 'http' && httpsEnabled) {
    throw new Error('J.A.R.V.I.S. Bootstrap | server.https.enabled está activo, pero server.protocol no está configurado como https.');
  }

  if (protocol === 'https' && httpsKeyFile.length === 0) {
    throw new Error('J.A.R.V.I.S. Bootstrap | HTTPS está activo, pero no se configuró server.https.keyFile.');
  }

  if (protocol === 'https' && httpsCertFile.length === 0) {
    throw new Error('J.A.R.V.I.S. Bootstrap | HTTPS está activo, pero no se configuró server.https.certFile.');
  }
}

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

  const serverProtocol = resolveBootstrapServerProtocol(
    config.get('server.protocol')
  );

  const serverHttpsEnabled = getBootstrapBoolean(
    config.get('server.https.enabled'),
    false
  );

  const serverHttpsKeyFile = getBootstrapString(
    config.get('server.https.keyFile'),
    ''
  );

  const serverHttpsCertFile = getBootstrapString(
    config.get('server.https.certFile'),
    ''
  );

  validateBootstrapServerOptions(
    serverProtocol,
    serverHttpsEnabled,
    serverHttpsKeyFile,
    serverHttpsCertFile
  );

  /**
   * Normalización de configuración para @jarvis/logger.
   *
   * La configuración se lee desde settings.packages.logger porque representa
   * opciones de un paquete instalable del ecosistema J.A.R.V.I.S.
   *
   * El bootstrap no crea el logger directamente. Solo prepara la estructura
   * que después se entregará a createLoggerModule().
   */
  const loggerEnabled = getBootstrapBoolean(
    config.get('packages.logger.enabled'),
    true
  );

  const loggerLevel = getBootstrapLoggerLevel(
    config.get('packages.logger.level')
  );

  const loggerConsoleEnabled = getBootstrapBoolean(
    config.get('packages.logger.console.enabled'),
    true
  );

  const loggerConsoleColors = getBootstrapBoolean(
    config.get('packages.logger.console.colors'),
    true
  );

  const loggerFileEnabled = getBootstrapBoolean(
    config.get('packages.logger.file.enabled'),
    false
  );

  const loggerFilePath = getBootstrapString(
    config.get('packages.logger.file.path'),
    './logs'
  );

  const loggerFileSplitByLevel = getBootstrapBoolean(
    config.get('packages.logger.file.splitByLevel'),
    true
  );

  const loggerFileWriteAll = getBootstrapBoolean(
    config.get('packages.logger.file.writeAll'),
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
   * Construye la configuración final del servidor.
   *
   * keyFile y certFile solo se agregan cuando tienen valor real para evitar
   * enviar propiedades opcionales como undefined.
   */
  const server = {
    host: serverHost,
    port: serverPort,
    protocol: serverProtocol,
    https: {
      enabled: serverHttpsEnabled,
      ...(serverHttpsKeyFile.length > 0 ? { keyFile: serverHttpsKeyFile } : {}),
      ...(serverHttpsCertFile.length > 0 ? { certFile: serverHttpsCertFile } : {})
    }
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
    server,
    logger: {
      enabled: loggerEnabled,
      appName: buildBootstrapLoggerAppName(appName),
      level: loggerLevel,
      defaultPackage: buildBootstrapLoggerDefaultModule(appName),
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
