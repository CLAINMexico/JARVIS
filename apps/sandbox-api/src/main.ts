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
 * createConfigModule() permite crear un módulo vivo de configuración.
 */
import {
  createConfigModule
} from '@jarvis/config';

/**
 * Se importa como type porque ConfigService solo se usa para tipar
 * el servicio registrado dentro del core.
 */
import type {
  ConfigService
} from '@jarvis/config';

/**
 * Se importa el factory principal de @jarvis/logger.
 *
 * createLoggerModule() permite crear un módulo vivo de logger.
 */
import {
  createLoggerModule
} from '@jarvis/logger';

/**
 * Se importa como type porque LoggerService solo se usa para tipar
 * el servicio registrado dentro del core.
 */
import type {
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
 * Esta etapa ocurre antes de arrancar @jarvis/core y permite:
 * - Leer settings.json.
 * - Crear ConfigService.
 * - Normalizar app.
 * - Normalizar server.
 * - Normalizar logger.
 *
 * De esta forma @jarvis/core no necesita saber cómo leer archivos
 * ni depender directamente de @jarvis/config.
 */
const jarvisBootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

/**
 * Se crea el módulo real de configuración.
 *
 * En este flujo, @jarvis/bootstrap ya leyó settings.json, por lo que
 * @jarvis/config recibe los valores cargados mediante values.
 *
 * Esto evita leer el mismo archivo dos veces y mantiene un flujo
 * de arranque más claro:
 *
 * bootstrap -> configModule -> core
 */
const configModule = createConfigModule({
  values: jarvisBootstrap.settings
});

/**
 * Se crea el módulo real de logger.
 *
 * @jarvis/bootstrap normaliza previamente la configuración del logger
 * desde settings.json, por lo que aquí se entrega directamente.
 *
 * Esto permite que @jarvis/logger use:
 * - appName
 * - level
 * - defaultModule
 * - timeZone
 * - console
 * - file
 */
const loggerModule = createLoggerModule(
  jarvisBootstrap.logger
);

/**
 * Se arranca una instancia de J.A.R.V.I.S.
 *
 * Esta aplicación no representa todavía una API real de negocio.
 * Su objetivo es validar que el core pueda bootear, recibir configuración
 * inicial, registrar módulos y ejecutar módulos vivos del runtime.
 *
 * En este flujo:
 * - @jarvis/bootstrap prepara los valores iniciales.
 * - @jarvis/config expone ConfigService.
 * - @jarvis/logger expone LoggerService.
 * - @jarvis/core orquesta el ciclo de vida.
 */
const core = await Jarvis.boot({
  app: jarvisBootstrap.app,
  server: jarvisBootstrap.server,
  runtimeModules: [
    configModule,
    loggerModule
  ]
});

/**
 * Se ejecuta el arranque de los módulos vivos.
 *
 * Cada módulo que tenga método boot() será inicializado por el core.
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
 * Se obtiene @jarvis/config como servicio registrado en el core.
 *
 * Esto permite consultar la configuración cargada desde settings.json
 * usando ConfigService.
 */
const config = core.service<ConfigService>('config');

/**
 * Se obtiene @jarvis/logger como servicio registrado en el core.
 *
 * Esto permite escribir logs de consola y archivo usando LoggerService.
 */
const logger = core.service<LoggerService>('logger');

/**
 * Se imprime información general del runtime.
 *
 * Esta sección valida que @jarvis/core sigue arrancando correctamente
 * después de montar módulos reales.
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
 * Se confirma que @jarvis/config quedó disponible como servicio.
 *
 * config?.all() devuelve la configuración completa disponible desde
 * el servicio registrado en core.
 *
 * Nota:
 * Esta salida es útil para el sandbox, pero en una app real no se debe
 * imprimir configuración completa si contiene datos sensibles o referencias
 * que no deban exponerse en logs.
 */
logger?.info('================================================================================');
logger?.info('- Package - Config | Inicializado:');
logger?.info('================================================================================');
logger?.info('Configuración cargada desde settings.json.', {
  module: `${instance.name} | ${instance.app.name}`,
  data: config?.all()
});

/**
 * Se confirma que @jarvis/logger quedó disponible como servicio
 * dentro del runtime.
 *
 * Esta salida valida la integración real del módulo logger sin generar
 * errores falsos durante una ejecución normal del sandbox.
 */
logger?.info('================================================================================');
logger?.info('- Package - Logger | Inicializado:');
logger?.info('================================================================================');
logger?.info('Package - Logger | Servicio disponible desde core.service().');

/**
 * Se imprime una muestra controlada de metadata.
 *
 * Esta salida permite validar que @jarvis/logger puede escribir contexto
 * adicional usando objetos serializados en formato JSON legible.
 */
logger?.debug('Package - Logger | Metadata de arranque normalizada.', {
  module: `${instance.name} | ${instance.app.name}`,
  data: {
    app: jarvisBootstrap.app,
    server: jarvisBootstrap.server,
    logger: jarvisBootstrap.logger
  }
});

/**
 * Se ejecuta el apagado de los módulos vivos.
 *
 * El core apagará los módulos en orden inverso al arranque.
 */
await core.shutdown();
