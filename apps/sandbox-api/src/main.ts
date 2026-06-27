import Fastify from 'fastify';

import type {
  FastifyInstance
} from 'fastify';

import {
  Jarvis
} from '@jarvis/core';

import type {
  JarvisApplication
} from '@jarvis/core';

import {
  createConfigModule
} from '@jarvis/config';

import type {
  ConfigService
} from '@jarvis/config';

import {
  createLoggerModule
} from '@jarvis/logger';

import type {
  LoggerService
} from '@jarvis/logger';

import {
  createJarvisBootstrap
} from '@jarvis/bootstrap';

/**
 * Ejecuta el arranque principal de Sandbox-API.
 *
 * Esta función concentra el flujo completo de arranque para mantener
 * controlado el bootstrap, la creación de módulos, el arranque del core,
 * la validación de servicios, el servidor HTTP y el apagado seguro.
 */
async function main(): Promise<void> {
  let core: JarvisApplication | undefined;
  let logger: LoggerService | undefined;
  let server: FastifyInstance | undefined;
  let shuttingDown = false;

  /**
   * Ejecuta el apagado seguro de Sandbox-API.
   *
   * El orden es importante:
   * - Primero se cierra el servidor HTTP para dejar de recibir peticiones.
   * - Después se apaga el runtime de J.A.R.V.I.S. mediante core.shutdown().
   */
  async function shutdown(reason: string): Promise<void> {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    try {
      logger?.warn(`Sandbox-API | Apagado iniciado.`, {
        module: reason
      });
      if (server) {
        await server.close();
        logger?.warn('Sandbox-API | Servidor HTTP cerrado correctamente.', {
          module: reason
        });
      }
      if (core) {
        await core.shutdown();
        logger?.warn('Sandbox-API | Runtime de J.A.R.V.I.S. apagado correctamente.', {
          module: reason
        });
      }
    } catch (error: unknown) {
      if (logger) {
        logger.error('Sandbox-API | Error durante el apagado de J.A.R.V.I.S.', {
          module: reason,
          error
        });
        return;
      }
      console.error('Sandbox-API | Error durante el apagado de J.A.R.V.I.S.', error);
    }
  }

  try {
    /**
     * Prepara la configuración inicial antes de arrancar el runtime.
     *
     * En esta etapa se lee settings.json, se normalizan los valores base
     * de la aplicación y se prepara la configuración necesaria para crear
     * los módulos reales.
     *
     * @jarvis/core no debe leer archivos ni depender directamente de
     * paquetes concretos como @jarvis/config o @jarvis/logger.
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
     * desde settings.json, incluyendo el switch maestro enabled y las
     * opciones de consola, archivos, nivel, módulo por defecto y zona horaria.
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
    core = await Jarvis.boot({
      app: jarvisBootstrap.app,
      server: jarvisBootstrap.server,
      runtimeModules: [
        configModule,
        loggerModule
      ]
    });

    /**
     * Ejecuta el arranque de los módulos vivos.
     *
     * Cada módulo que tenga método boot() será inicializado por el core
     * en el orden en el que fue registrado.
     */
    await core.bootModules();

    /**
     * Obtiene la información normalizada de la instancia arrancada.
     *
     * A partir de este punto, los valores opcionales ya fueron resueltos
     * por el core, por ejemplo environment, host, port y status de módulos.
     */
    const instance = core.info();

    /**
     * Obtiene @jarvis/config como servicio registrado en el core.
     *
     * Esto permite consultar la configuración cargada desde settings.json
     * usando ConfigService.
     */
    const config = core.service<ConfigService>('config');

    /**
     * Obtiene @jarvis/logger como servicio registrado en el core.
     *
     * Esto permite escribir logs de consola y archivo usando LoggerService.
     */
    logger = core.service<LoggerService>('logger');

    /**
     * Imprime información general del runtime.
     *
     * Esta sección valida que @jarvis/core sigue arrancando correctamente
     * después de montar módulos reales.
     */
    logger?.debug('================================================================================');
    logger?.debug(`* App: ${instance.name} | ${instance.app.name}`);
    logger?.debug(`* Description: ${instance.app.description}`);
    logger?.debug(`* Version: ${instance.app.version}`);
    logger?.debug(`* Environment: ${instance.app.environment}`);
    logger?.debug(`* Status: ${instance.status}`);

    /**
     * Confirma que @jarvis/config quedó disponible como servicio.
     *
     * config?.all() devuelve la configuración completa disponible desde
     * el servicio registrado en core.
     *
     * Nota:
     * Esta salida es útil únicamente para el sandbox.
     *
     * En una aplicación real no se debe imprimir la configuración completa,
     * ya que podría contener referencias, rutas internas o valores sensibles.
     */
    logger?.info('================================================================================');
    logger?.info('* Package - Config | Inicializado.');
    if (instance.app.environment === 'production') {
      logger?.info('* Package - Config | Configuración cargada desde settings.json.', {
        module: `${instance.name} | ${instance.app.name}`
      });
    } else {
      logger?.info('* Package - Config | Configuración cargada desde settings.json.', {
        module: `${instance.name} | ${instance.app.name}`,
        data: config?.all()
      });
    }

    /**
     * Confirma que @jarvis/logger quedó disponible como servicio
     * dentro del runtime.
     *
     * Esta salida valida la integración real del módulo logger sin generar
     * errores falsos durante una ejecución normal del sandbox.
     */
    logger?.info('================================================================================');
    logger?.info('* Package - Logger | Inicializado');
    if (instance.app.environment === 'production') {
      logger?.info('* Package - Logger | Metadata de arranque normalizada.');
    } else {
      logger?.info('* Package - Logger | Metadata de arranque normalizada.', {
        module: `${instance.name} | ${instance.app.name}`,
        data: {
          app: jarvisBootstrap.app,
          server: jarvisBootstrap.server,
          logger: jarvisBootstrap.logger
        }
      });
    }





    /**
     * Crea el servidor HTTP inicial de Sandbox-API.
     *
     * En esta versión el servidor vive dentro del sandbox y expone rutas
     * mínimas para validar que J.A.R.V.I.S. puede responder por HTTP.
     */
    server = Fastify({
      logger: false
    });
    /**
     * Ruta raíz de Sandbox-API.
     *
     * Permite validar rápidamente que la API está disponible y muestra
     * las rutas base expuestas por esta versión del sandbox.
     */
    server.get('/', async () => ({
      name: `${instance.name} | ${instance.app.name}`,
      status: 'running',
      runtime: instance.name,
      app: instance.app.name,
      environment: instance.app.environment,
      routes: [
        '/',
        '/health',
        '/info',
        '/modules'
      ]
    }));
    /**
     * Ruta básica de salud.
     *
     * Permite validar que el servidor HTTP está vivo.
     */
    server.get('/health', async () => ({
      status: 'ok',
      app: instance.app.name,
      runtime: instance.name,
      environment: instance.app.environment
    }));
    /**
     * Ruta de información general del runtime.
     *
     * Devuelve la misma información expuesta por core.info().
     */
    server.get('/info', async () => core?.info());
    /**
     * Ruta de módulos registrados.
     *
     * Devuelve la lista de módulos conocidos por el runtime.
     */
    server.get('/modules', async () => core?.modules());
    /**
     * Registra señales del sistema para apagar de forma segura.
     *
     * SIGINT normalmente ocurre al detener el proceso manualmente.
     * SIGTERM normalmente ocurre cuando Docker o el sistema solicitan apagar.
     */
    process.once('SIGINT', () => {
      void shutdown('SIGINT');
    });
    process.once('SIGTERM', () => {
      void shutdown('SIGTERM');
    });
    /**
     * Arranca el servidor HTTP usando host y port normalizados por J.A.R.V.I.S.
     */
    await server.listen({
      host: instance.server.host,
      port: instance.server.port
    });
    logger?.info('================================================================================');
    logger?.info('* Dependence - Fastify | Inicializado');
    logger?.info(`* Dependence - Fastify | Servidor HTTP: http://${instance.server.host}:${instance.server.port}`, {
      module: `${instance.name} | ${instance.app.name}`
    });





  } catch (error: unknown) {
    /**
     * Maneja errores ocurridos durante el arranque.
     *
     * Si el logger ya está disponible, se usa LoggerService.
     * Si el error ocurre antes de tener logger, se usa console.error()
     * como salida mínima de emergencia.
     */
    if (logger) {
      logger.fatal('Sandbox-API | Error durante el arranque de J.A.R.V.I.S.', {
        module: 'Sandbox-API',
        error
      });
      await shutdown('STARTUPERR');
      return;
    }
    console.error('Sandbox-API | Error durante el arranque de J.A.R.V.I.S.', error);
    await shutdown('STARTUPERR');
  }
}

void main();
