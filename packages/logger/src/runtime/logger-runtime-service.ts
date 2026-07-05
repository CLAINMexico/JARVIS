import type {
  LoggerContext
} from '../contracts/logger-contract-context.js';

import type {
  LoggerEntry
} from '../contracts/logger-contract-entry.js';

import type {
  LoggerLevel
} from '../contracts/logger-contract-level.js';

import type {
  LoggerTransport
} from '../contracts/logger-contract-transport.js';

import {
  shouldLog
} from '../utils/logger-util-level.js';

/**
 * Opciones internas del servicio de logger.
 *
 * Estas opciones ya deben llegar normalizadas desde createLoggerModule().
 */
export interface LoggerServiceOptions {
  /**
   * Nombre de la aplicación usado para impresión visual.
   *
   * Este valor representa el bloque:
   *
   * [J.A.R.V.I.S. | App]
   *
   * dentro del formato homologado.
   */
  appName: string;

  /**
   * Nivel mínimo que será procesado por el logger.
   *
   * Los eventos con menor prioridad serán ignorados antes de enviarse
   * a los transports.
   */
  level: LoggerLevel;

  /**
   * Paquete por defecto usado cuando el log no recibe uno explícito
   * mediante context.package.
   *
   * Este valor representa el bloque [PACKAGE] dentro del formato homologado.
   */
  defaultPackage: string;

  /**
   * Módulo por defecto usado cuando el log no recibe uno explícito
   * mediante context.module.
   */
  defaultModule: string;

  /**
   * Zona horaria usada para representar fechas del logger.
   *
   * El Date original no se modifica; la zona horaria solo se usa
   * al momento de formatear la salida.
   */
  timeZone: string;

  /**
   * Indica si los errores deben imprimirse completos.
   *
   * true:
   * - Imprime stack trace cuando existe.
   *
   * false:
   * - Imprime una versión segura y resumida del error.
   */
  verboseError: boolean;

  /**
   * Lista de salidas donde se escribirá cada evento de log.
   *
   * Puede incluir consola, archivos u otros transports futuros.
   */
  transports: LoggerTransport[];
}

/**
 * Servicio principal de logging de J.A.R.V.I.S.
 *
 * Este servicio crea eventos normalizados de log y los distribuye hacia
 * los transports configurados.
 *
 * También mantiene una cola interna de escritura para conservar el orden
 * de los logs cuando se registran varios eventos de forma consecutiva.
 */
export class LoggerService {
  /**
   * Nombre de la aplicación usado por los formatters.
   */
  private readonly appName: string;

  /**
   * Nivel mínimo configurado para procesar eventos.
   */
  private readonly level: LoggerLevel;

  /**
   * Paquete por defecto usado cuando no se especifica context.package.
   */
  private readonly defaultPackage: string;

  /**
   * Módulo por defecto usado cuando no se especifica context.module.
   */
  private readonly defaultModule: string;

  /**
   * Zona horaria usada por los formatters para representar fechas.
   */
  private readonly timeZone: string;

  /**
   * Indica si los errores deben imprimirse completos.
   */
  private readonly verboseError: boolean;

  /**
   * Lista de destinos donde se escribirán los eventos procesados.
   */
  private readonly transports: LoggerTransport[];

  /**
   * Cola interna de escritura.
   *
   * Permite encadenar escrituras para evitar que los logs se mezclen
   * fuera de orden, especialmente en transports asíncronos como archivos.
   */
  private writeQueue: Promise<void> = Promise.resolve();

  /**
   * Crea una nueva instancia de LoggerService.
   */
  public constructor(options: LoggerServiceOptions) {
    this.appName = options.appName;
    this.level = options.level;
    this.defaultPackage = options.defaultPackage;
    this.defaultModule = options.defaultModule;
    this.timeZone = options.timeZone;
    this.verboseError = options.verboseError;
    this.transports = options.transports;
  }

  /**
   * Registra un mensaje de nivel debug.
   */
  public debug(message: string, context: LoggerContext = {}): void {
    void this.enqueue('debug', message, context);
  }

  /**
   * Registra un mensaje de nivel info.
   */
  public info(message: string, context: LoggerContext = {}): void {
    void this.enqueue('info', message, context);
  }

  /**
   * Registra un mensaje de nivel warn.
   */
  public warn(message: string, context: LoggerContext = {}): void {
    void this.enqueue('warn', message, context);
  }

  /**
   * Registra un mensaje de nivel error.
   */
  public error(message: string, context: LoggerContext = {}): void {
    void this.enqueue('error', message, context);
  }

  /**
   * Registra un mensaje de nivel fatal.
   */
  public fatal(message: string, context: LoggerContext = {}): void {
    void this.enqueue('fatal', message, context);
  }

  /**
   * Crea un logger hijo asociado a un módulo específico.
   *
   * El logger hijo comparte nombre de app, paquete por defecto, nivel, zona
   * horaria, configuración de errores y transports con el logger principal,
   * pero cambia el módulo por defecto.
   *
   * Esto permite evitar repetir { module: 'Config' } en cada log.
   */
  public child(module: string): LoggerService {
    return new LoggerService({
      appName: this.appName,
      level: this.level,
      defaultPackage: this.defaultPackage,
      defaultModule: module,
      timeZone: this.timeZone,
      verboseError: this.verboseError,
      transports: this.transports
    });
  }

  /**
   * Crea un logger hijo asociado a un paquete específico.
   *
   * El logger hijo comparte nombre de app, nivel, zona horaria, configuración
   * de errores y transports con el logger principal, pero cambia el paquete
   * por defecto.
   *
   * Esto permite generar logs homologados por paquete sin repetir
   * { package: '@jarvis/http' } en cada llamada.
   */
  public package(packageName: string): LoggerService {
    return new LoggerService({
      appName: this.appName,
      level: this.level,
      defaultPackage: packageName,
      defaultModule: this.defaultModule,
      timeZone: this.timeZone,
      verboseError: this.verboseError,
      transports: this.transports
    });
  }

  /**
   * Agrega una escritura a la cola interna del logger.
   *
   * Los métodos públicos no esperan la escritura directamente. En su lugar,
   * encadenan el trabajo para conservar el orden de salida sin obligar al
   * consumidor a usar await en cada log.
   *
   * Si ocurre un error interno durante la escritura, se reporta en consola
   * para evitar que la cola quede rota silenciosamente.
   */
  private enqueue(
    level: LoggerLevel,
    message: string,
    context: LoggerContext
  ): void {
    this.writeQueue = this.writeQueue
      .then(() => this.write(level, message, context))
      .catch((error: unknown) => {
        console.error('[LOGGER] Error interno al escribir log.', error);
      });
  }

  /**
   * Construye una entrada normalizada y la envía a los transports.
   *
   * Antes de crear el evento, valida si el nivel recibido debe procesarse
   * según el nivel mínimo configurado.
   */
  private async write(
    level: LoggerLevel,
    message: string,
    context: LoggerContext
  ): Promise<void> {
    if (!shouldLog(level, this.level)) {
      return;
    }

    const entry: LoggerEntry = {
      level,
      message,
      timestamp: new Date(),
      timeZone: this.timeZone,
      appName: this.appName,
      package: typeof context.package === 'string'
        ? context.package
        : this.defaultPackage,
      module: typeof context.module === 'string'
        ? context.module
        : this.defaultModule,
      ...(typeof context.event === 'string' ? { event: context.event } : {}),
      ...(typeof context.statusCode === 'number' ? { statusCode: context.statusCode } : {}),
      verboseError: this.verboseError,
      context
    };

    for (const transport of this.transports) {
      await transport.write(entry);
    }
  }
}
