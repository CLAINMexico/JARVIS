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

import {
  createSandboxHttpServer
} from './http/sandbox-http-server.js';

import {
  registerSandboxHttpRoutes
} from './http/sandbox-http-routes.js';

import {
  resolveSandboxHttpOptions
} from './http/sandbox-http-options.js';

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
     */
    const jarvisBootstrap = await createJarvisBootstrap({
      settingsFile: './settings.json'
    });

    /**
     * Se crea el módulo real de configuración.
     */
    const configModule = createConfigModule({
      values: jarvisBootstrap.settings
    });

    /**
     * Se crea el módulo real de logger.
     */
    const loggerModule = createLoggerModule(
      jarvisBootstrap.logger
    );

    /**
     * Se arranca una instancia de J.A.R.V.I.S.
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
     */
    await core.bootModules();

    /**
     * Obtiene la información normalizada de la instancia arrancada.
     */
    const instance = core.info();

    /**
     * Obtiene @jarvis/config como servicio registrado en el core.
     */
    const config = core.service<ConfigService>('config');

    /**
     * Resuelve las opciones finales del servidor HTTP/HTTPS.
     *
     * La configuración viene desde core.info().server, después de haber sido
     * leída por @jarvis/bootstrap y normalizada por @jarvis/core.
     *
     * A partir de estas opciones, Sandbox-API decide si debe crear Fastify en
     * modo HTTP o HTTPS, qué host/puerto debe usar y qué URL debe reportar
     * en las bitácoras.
     */
    const httpOptions = resolveSandboxHttpOptions(
      instance.server
    );

    /**
     * Obtiene @jarvis/logger como servicio registrado en el core.
     */
    logger = core.service<LoggerService>('logger');

    logger?.debug('================================================================================');
    logger?.debug(`* App: ${instance.name} | ${instance.app.name}`);
    logger?.debug(`* Description: ${instance.app.description}`);
    logger?.debug(`* Version: ${instance.app.version}`);
    logger?.debug(`* Environment: ${instance.app.environment}`);
    logger?.debug(`* Status: ${instance.status}`);

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
     * Crea el servidor HTTP de Sandbox-API.
     *
     * La creación del servidor vive en src/http/sandbox-http-server.ts para
     * mantener main.ts como orquestador del arranque general.
     */
    server = await createSandboxHttpServer(
      httpOptions
    );

    /**
     * Registra las rutas HTTP base de Sandbox-API.
     *
     * El registro de rutas vive en src/http/sandbox-http-routes.ts para
     * mantener separada la responsabilidad de exposición HTTP.
     */
    registerSandboxHttpRoutes(
      server,
      core
    );

    /**
     * Registra señales del sistema para apagar de forma segura.
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
      host: httpOptions.host,
      port: httpOptions.port
    });

    logger?.info('================================================================================');
    logger?.info('* Dependence - Fastify | Inicializado');
    logger?.info(`* Dependence - Fastify | Servidor ${httpOptions.protocol.toUpperCase()}: ${httpOptions.url}`, {
      module: `${instance.name} | ${instance.app.name}`
    });
  } catch (error: unknown) {
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
