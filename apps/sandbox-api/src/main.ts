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
  SecurityJwtService
} from '@jarvis/security';

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

import {
  resolveSandboxSecurityJwtOptions
} from './security/sandbox-security-jwt-options.js';

/**
 * Paquete visual usado por los logs propios de Sandbox-API.
 */
const SandboxPackageName = 'Sandbox-API';

/**
 * Separador visual para agrupar logs importantes del arranque.
 */
const SandboxLogSeparator = '================================================================================';

/**
 * Ejecuta el arranque principal de Sandbox-API.
 *
 * Esta función concentra el flujo completo de arranque para mantener
 * controlado el bootstrap, la creación de módulos, el arranque del core,
 * la validación de servicios, el servidor HTTP/HTTPS y el apagado seguro.
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
   * - Primero se cierra el servidor HTTP/HTTPS para dejar de recibir peticiones.
   * - Después se apaga el runtime de J.A.R.V.I.S. mediante core.shutdown().
   */
  async function shutdown(reason: string): Promise<void> {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    try {
      logger?.warn('Apagado seguro iniciado.', {
        package: SandboxPackageName,
        event: 'sandbox.shutdown.started',
        reason
      });

      if (server) {
        await server.close();

        logger?.warn('Servidor HTTP/HTTPS cerrado correctamente.', {
          package: SandboxPackageName,
          event: 'sandbox.http.closed',
          reason
        });
      }

      if (core) {
        await core.shutdown();

        logger?.warn('Runtime de J.A.R.V.I.S. apagado correctamente.', {
          package: SandboxPackageName,
          event: 'sandbox.runtime.closed',
          reason
        });
      }
    } catch (error: unknown) {
      if (logger) {
        logger.error('Error durante el apagado de J.A.R.V.I.S.', {
          package: SandboxPackageName,
          event: 'sandbox.shutdown.failed',
          reason,
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

    if (!config) {
      throw new Error('Sandbox-API | No se pudo resolver el servicio @jarvis/config.');
    }

    /**
     * Obtiene @jarvis/logger como servicio registrado en el core.
     */
    logger = core.service<LoggerService>('logger');

    if (!logger) {
      throw new Error('Sandbox-API | No se pudo resolver el servicio @jarvis/logger.');
    }

    /**
     * Resuelve las opciones de seguridad JWT para Sandbox-API.
     *
     * Reglas oficiales:
     * - issuer se fija internamente como J.A.R.V.I.S.
     * - audience se resuelve desde app.name.
     * - secret puede venir como placeholder de variable de entorno.
     */
    const securityJwtOptions = resolveSandboxSecurityJwtOptions(
      config,
      instance.app.name
    );

    /**
     * Crea el servicio JWT de @jarvis/security.
     *
     * Este servicio se usa para rutas de prueba de firma y verificación.
     * La protección real de rutas se integrará mediante autenticación Bearer.
     */
    const securityJwt = new SecurityJwtService(
      securityJwtOptions
    );

    /**
     * Resuelve las opciones finales del servidor HTTP/HTTPS.
     *
     * La configuración viene desde core.info().server, después de haber sido
     * leída por @jarvis/bootstrap y normalizada por @jarvis/core.
     */
    const httpOptions = resolveSandboxHttpOptions(
      instance.server
    );

    /**
     * Crea el servidor HTTP/HTTPS de Sandbox-API.
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
      core,
      securityJwt
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
     * Arranca el servidor HTTP/HTTPS usando host y port normalizados por
     * J.A.R.V.I.S.
     */
    await server.listen({
      host: httpOptions.host,
      port: httpOptions.port
    });

    /**
     * Logs resumidos del arranque.
     *
     * Se agrupan en secciones pequeñas para evitar imprimir demasiada
     * información cruda en consola y mantener una lectura limpia.
     */
    logger.info(SandboxLogSeparator, {
      package: SandboxPackageName,
      event: 'sandbox.boot.separator'
    });

    logger.info('Datos de la aplicación.', {
      package: SandboxPackageName,
      event: 'sandbox.boot.app.data',
      data: {
        runtime: {
          name: instance.name,
          description: instance.description,
          status: instance.status
        },
        app: {
          name: instance.app.name,
          description: instance.app.description,
          version: instance.app.version,
          environment: instance.app.environment,
          timeZone: instance.app.timeZone
        },
        server: {
          host: httpOptions.host,
          port: httpOptions.port,
          protocol: httpOptions.protocol,
          url: httpOptions.url
        }
      }
    });

    logger.info('Packages cargados e inicializados.', {
      package: SandboxPackageName,
      event: 'sandbox.boot.packages.initialized',
      data: {
        packages: [
          {
            name: '@jarvis/config',
            status: 'initialized'
          },
          {
            name: '@jarvis/logger',
            status: 'initialized'
          },
          {
            name: '@jarvis/security',
            status: 'initialized'
          },
          {
            name: 'Fastify',
            status: 'initialized'
          }
        ],
        runtimeModules: core.modules()
      }
    });

    logger.info(`Servidor ${httpOptions.protocol.toUpperCase()}: ${httpOptions.url}`, {
      package: 'Fastify',
      event: 'fastify.server.started',
      statusCode: 200
    });

    logger.info(SandboxLogSeparator, {
      package: SandboxPackageName,
      event: 'sandbox.boot.separator'
    });
  } catch (error: unknown) {
    if (logger) {
      logger.fatal('Error durante el arranque de J.A.R.V.I.S.', {
        package: SandboxPackageName,
        event: 'sandbox.startup.failed',
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
