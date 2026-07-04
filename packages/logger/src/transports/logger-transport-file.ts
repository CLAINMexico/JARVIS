import {
  mkdir,
  appendFile
} from 'node:fs/promises';

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
  formatLoggerFileEntry
} from '../formatters/logger-formatter-file.js';

import {
  getLoggerDirectory,
  getLoggerFilePath
} from '../utils/logger-util-path.js';

/**
 * Opciones del transport de archivos.
 */
export interface LoggerFileTransportOptions {
  /**
   * Ruta base donde se crearán los archivos de log.
   *
   * Ejemplo:
   * ./logs
   */
  path: string;

  /**
   * Indica si todos los logs deben escribirse también en un archivo general.
   *
   * Cuando está activo, se crea o actualiza el archivo all.log con todos los
   * eventos procesados.
   */
  writeAll?: boolean;

  /**
   * Indica si los logs deben escribirse en archivos separados por nivel.
   *
   * Cuando está activo, se crean o actualizan archivos como debug.log,
   * info.log, warn.log, error.log y fatal.log según el nivel del evento.
   */
  splitByLevel?: boolean;
}

/**
 * Transport encargado de escribir eventos de log en archivos.
 *
 * Este transport recibe entradas normalizadas, las convierte a texto usando
 * el formatter de archivos y las escribe en la estructura estándar:
 *
 * logs/YYYY/MM/DD/all.log
 * logs/YYYY/MM/DD/debug.log
 * logs/YYYY/MM/DD/info.log
 * logs/YYYY/MM/DD/warn.log
 * logs/YYYY/MM/DD/error.log
 * logs/YYYY/MM/DD/fatal.log
 */
export class LoggerFileTransport implements LoggerTransport {
  /**
   * Ruta base donde se guardarán los logs.
   */
  private readonly path: string;

  /**
   * Indica si se debe escribir un archivo concentrado all.log.
   */
  private readonly writeAll: boolean;

  /**
   * Indica si se deben escribir archivos separados por nivel.
   */
  private readonly splitByLevel: boolean;

  /**
   * Crea una nueva instancia del transport de archivos.
   */
  public constructor(options: LoggerFileTransportOptions) {
    this.path = options.path;
    this.writeAll = options.writeAll ?? true;
    this.splitByLevel = options.splitByLevel ?? true;
  }

  /**
   * Escribe una entrada de log en uno o varios archivos.
   *
   * Primero asegura que exista el directorio del día correspondiente.
   * Después prepara la línea de log y la escribe en los archivos habilitados:
   *
   * - all.log, si writeAll está activo.
   * - Archivo por nivel, si splitByLevel está activo.
   */
  public async write(entry: LoggerEntry): Promise<void> {
    const directory = getLoggerDirectory(
      this.path,
      entry.timestamp,
      entry.timeZone
    );

    const line = `${formatLoggerFileEntry(entry)}\n`;

    await mkdir(directory, {
      recursive: true
    });

    const tasks: Promise<void>[] = [];

    if (this.writeAll) {
      tasks.push(
        this.writeToFile('all', entry, line)
      );
    }

    if (this.splitByLevel) {
      tasks.push(
        this.writeToFile(entry.level, entry, line)
      );
    }

    await Promise.all(tasks);
  }

  /**
   * Escribe una línea en el archivo correspondiente.
   *
   * El archivo final se resuelve a partir de la ruta base, el nivel del log,
   * el timestamp y la zona horaria del evento.
   */
  private async writeToFile(
    level: LoggerLevel | 'all',
    entry: LoggerEntry,
    line: string
  ): Promise<void> {
    const filePath = getLoggerFilePath(
      this.path,
      level,
      entry.timestamp,
      entry.timeZone
    );

    await appendFile(filePath, line, 'utf-8');
  }
}
