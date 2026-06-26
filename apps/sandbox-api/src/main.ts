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
 * Ejecuta el arranque principal de Sandbox API.
 *
 * Esta función concentra el flujo completo de arranque para mantener
 * controlado el bootstrap, la creación de módulos, el arranque del core,
 * la validación de servicios y el apagado seguro.
 */
async function main(): Promise<void> {
  let core: JarvisApplication | undefined;
  let logger: LoggerService | undefined;

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
    logger?.debug(`- App: ${instance.name} | ${instance.app.name}`);
    logger?.debug(`- Description: ${instance.app.description}`);
    logger?.debug(`- Version: ${instance.app.version}`);
    logger?.debug(`- Environment: ${instance.app.environment}`);
    logger?.debug('================================================================================');
    logger?.debug(`- Server: ${instance.server.host}:${instance.server.port}`);
    logger?.debug(`- Status: ${instance.status}`);

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
    logger?.info('- Package - Config | Inicializado:');
    logger?.info('================================================================================');

    if (instance.app.environment === 'production') {
      logger?.info('Configuración cargada desde settings.json. La salida completa fue omitida por ambiente production.', {
        module: `${instance.name} | ${instance.app.name}`
      });
    } else {
      logger?.info('Configuración cargada desde settings.json.', {
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
    logger?.info('- Package - Logger | Inicializado:');
    logger?.info('================================================================================');
    logger?.info('Package - Logger | Servicio disponible desde core.service().');

    /**
     * Imprime una muestra controlada de metadata.
     *
     * Esta salida permite validar que @jarvis/logger puede escribir contexto
     * adicional usando objetos serializados en formato JSON legible.
     *
     * Nota:
     * Esta metadata está pensada para pruebas del sandbox. En aplicaciones
     * reales se debe evitar registrar configuración completa o sensible.
     */
    logger?.debug('Package - Logger | Metadata de arranque normalizada.', {
      module: `${instance.name} | ${instance.app.name}`,
      data: {
        app: jarvisBootstrap.app,
        server: jarvisBootstrap.server,
        logger: jarvisBootstrap.logger
      }
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
      logger.fatal('Sandbox API | Error durante el arranque de J.A.R.V.I.S.', {
        module: 'Sandbox API',
        error
      });

      return;
    }

    console.error('[Sandbox API] Error durante el arranque de J.A.R.V.I.S.', error);
  } finally {
    /**
     * Ejecuta el apagado seguro del runtime.
     *
     * Si core alcanzó a arrancar, se intenta ejecutar shutdown() sin importar
     * si el flujo terminó correctamente o con error.
     */
    if (!core) {
      return;
    }

    try {
      await core.shutdown();
    } catch (error: unknown) {
      if (logger) {
        logger.error('Sandbox API | Error durante el apagado de J.A.R.V.I.S.', {
          module: 'Sandbox API',
          error
        });

        return;
      }

      console.error('[Sandbox API] Error durante el apagado de J.A.R.V.I.S.', error);
    }
  }
}

void main();
