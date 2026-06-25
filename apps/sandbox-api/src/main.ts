/**
 * Se importa el punto de entrada principal de @jarvis/core.
 *
 * Jarvis permite arrancar una instancia del runtime usando Jarvis.boot().
 */
import {
  Jarvis
} from '@jarvis/core';

/**
 * Se importa el factory principal de @jarvis/config.
 *
 * createConfigModule() Permite crear un módulo vivo de configuración.
 * ConfigService Permite cargar la clase del módulo definido por @jarvis/config.
 */
import {
  createConfigModule,
  ConfigService
} from '@jarvis/config';

/**
 * Se importa el factory principal de @jarvis/logger.
 *
 * createLoggerModule() Permite crear un módulo vivo de logger.
 * LoggerService Permite cargar la clase del módulo definido por @jarvis/logger.
 */
import {
  createLoggerModule,
  LoggerService
} from '@jarvis/logger';

/**
 * Se importa createJarvisBootstrap para preparar la configuración
 * inicial de la app antes de arrancar el runtime.
 */
import {
  createJarvisBootstrap
} from '@jarvis/bootstrap';

/**
 * Se ejecuta el bootstrap inicial de la app.
 *
 * Esta etapa ocurre antes de arrancar @jarvis/core y permite cargar
 * settings.json para normalizar app, server y logger.
 */
const bootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

/**
 * Se crea el módulo real de configuración.
 *
 * En este sandbox, @jarvis/config leerá el archivo settings.json
 * de la aplicación durante su método boot().
 *
 * Importante:
 * - settings.json contiene configuración no sensible.
 * - settings.json puede tener referencias hacia variables del .env.
 * - El archivo settings.json real no debe subirse a Git.
 */
const configModule = createConfigModule({
  values: bootstrap.settings
});

/**
 * Se crea el módulo real de logger
 *
 * En este sandbox, @jarvis/logger, permitira contar con una ambiente
 * controlado de logs y vista de depuración a nivel consola y archivos logs
 */
const loggerModule = createLoggerModule({
  appName: bootstrap.logger.appName,
  level: bootstrap.logger.level,
  defaultModule: bootstrap.logger.defaultModule,
  timeZone: bootstrap.logger.timeZone,
  console: bootstrap.logger.console,
  file: bootstrap.logger.file
});

/**
 * Se arranca una instancia de J.A.R.V.I.S.
 *
 * Esta aplicación no representa todavía una API real de negocio.
 * Su objetivo es validar que el core pueda bootear, recibir configuración
 * inicial, registrar módulos y ejecutar módulos vivos del runtime.
 *
 * En esta prueba, @jarvis/config ya no es un módulo falso: es un package
 * real montado por el core mediante runtimeModules.
 */
const core = await Jarvis.boot({
  app: bootstrap.app,
  server: bootstrap.server,
  runtimeModules: [
    configModule,
    loggerModule
  ]
});

/**
 * Se ejecuta el arranque de los módulos vivos.
 *
 * Cada módulo que tenga método boot() será inicializado por el core.
 * En este caso, @jarvis/config leerá settings.json y cargará sus valores
 * dentro de ConfigService.
 */
await core.bootModules();

/**
 * Se obtiene la información normalizada de la instancia arrancada.
 *
 * A partir de este punto, los valores opcionales ya fueron resueltos
 * por el core, por ejemplo environment, host, port y status de módulos.
 */
const instance = core.info();

/**
 * Se almacena el @jarvis/config como servicio
 *
 * Esta acción permite reservar la instancia del módulo de configuración
 * como servicio dentro del core.
 */
const config = core.service<ConfigService>('config');

/**
 * Se almacena el @jarvis/logger como servicio
 *
 * Esta acción permite reservar la instancia del módulo de logger
 * como servicio dentro del core.
 */
const logger = core.service<LoggerService>('logger');

/**
 * Se imprime información general del runtime.
 *
 * Esta sección valida que @jarvis/core sigue bootstrapped correctamente
 * después de montar el módulo real @jarvis/config.
 */
logger?.debug('================================================================================');
logger?.debug(`- App: ${instance.name} | ${instance.app.name}`);
logger?.debug(`- Description: ${instance.app.description}`);
logger?.debug(`- Version: ${instance.app.version}`);
logger?.debug(`- Environment: ${instance.app.environment}`);
logger?.debug('================================================================================');
logger?.debug(`- Server: ${instance.server.host}:${instance.server.port}`);
logger?.debug(`- Status: ${instance.status}`);

/**
 * Se imprime la configuración cargada por @jarvis/config.
 *
 * configModule.service.all() devuelve la configuración completa que fue
 * cargada desde settings.json durante boot().
 *
 * Nota:
 * Esta salida es útil para el sandbox, pero en una app real no se debe
 * imprimir configuración completa si contiene datos sensibles o referencias
 * que no deban exponerse en logs.
 */
logger?.info('================================================================================');
logger?.info('- Package - Config | Inicializado:');
logger?.info('================================================================================');
//console.log(config?.all());

/**
 * Se imprime loggers cargados por @jarvis/logger.
 */
logger?.info('================================================================================');
logger?.info('- Package - Logger | Inicializado:');
logger?.info('================================================================================');
logger?.info('Test Logger | INFO');
logger?.debug('Test Logger | DEBUG');
logger?.warn('Test Logger | WARN');
logger?.error('Test Logger | ERROR');
logger?.fatal('Test Logger | FATAL');

/**
 * Se ejecuta el apagado de los módulos vivos.
 *
 * El core apagará los módulos en orden inverso al arranque.
 * En este caso, ejecutará shutdown() de @jarvis/config.
 */
await core.shutdown();
