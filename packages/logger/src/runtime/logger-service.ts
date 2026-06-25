import type {
  LoggerContext
} from '../contracts/logger-context.js';

import type {
  LoggerEntry
} from '../contracts/logger-entry.js';

import type {
  LoggerLevel
} from '../contracts/logger-level.js';

import type {
  LoggerTransport
} from '../contracts/logger-transport.js';

import {
  shouldLog
} from '../utils/logger-level-utils.js';

/**
 * Opciones internas del servicio de logger.
 */
export interface LoggerServiceOptions {
  /**
   * Nivel mínimo que será procesado por el logger.
   */
  level: LoggerLevel;

  /**
   * Módulo por defecto usado cuando el log no recibe uno explícito.
   */
  defaultModule: string;

  /**
   * Zona horaria usada para representar fechas del logger.
   */
  timeZone: string;

  /**
   * Lista de salidas donde se escribirá cada evento de log.
   */
  transports: LoggerTransport[];
}

/**
 * Servicio principal de logging de J.A.R.V.I.S.
 *
 * Este servicio crea eventos normalizados de log y los distribuye
 * hacia los transports configurados.
 */
export class LoggerService {
  private readonly level: LoggerLevel;
  private readonly defaultModule: string;
  private readonly transports: LoggerTransport[];
  private readonly timeZone: string;
  private writeQueue: Promise<void> = Promise.resolve();

  public constructor(options: LoggerServiceOptions) {
    this.level = options.level;
    this.defaultModule = options.defaultModule;
    this.transports = options.transports;
    this.timeZone = options.timeZone;
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
   * Esto permite evitar repetir { module: 'Config' } en cada log.
   */
  public child(module: string): LoggerService {
    return new LoggerService({
      level: this.level,
      defaultModule: module,
      timeZone: this.timeZone,
      transports: this.transports
    });
  }

  /**
   * Agrega una escritura a la cola interna del logger.
   *
   * Esto conserva el orden de los logs aunque se llamen varios métodos
   * seguidos sin await.
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
      module: context.module ?? this.defaultModule,
      context
    };

    for (const transport of this.transports) {
      await transport.write(entry);
    }
  }
}
