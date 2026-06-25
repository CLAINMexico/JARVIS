import {
  mkdir,
  appendFile
} from 'node:fs/promises';

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
  formatLoggerFileEntry
} from '../formatters/logger-file-formatter.js';

import {
  getLoggerDirectory,
  getLoggerFilePath
} from '../utils/logger-path-utils.js';

/**
 * Opciones del transport de archivo.
 */
export interface LoggerFileTransportOptions {
  /**
   * Nombre de la aplicación usado para construir nombres de archivo.
   */
  appName: string;

  /**
   * Ruta base donde se crearán los archivos de log.
   */
  path: string;

  /**
   * Si está activo, escribe todos los logs en un archivo ALL.
   */
  writeAll?: boolean;

  /**
   * Si está activo, escribe logs en archivos separados por nivel.
   */
  splitByLevel?: boolean;
}

/**
 * Transport encargado de escribir logs en archivos.
 */
export class LoggerFileTransport implements LoggerTransport {
  private readonly appName: string;
  private readonly path: string;
  private readonly writeAll: boolean;
  private readonly splitByLevel: boolean;

  public constructor(options: LoggerFileTransportOptions) {
    this.appName = options.appName;
    this.path = options.path;
    this.writeAll = options.writeAll ?? true;
    this.splitByLevel = options.splitByLevel ?? true;
  }

  /**
   * Escribe una entrada de log en uno o varios archivos.
   */
  public async write(entry: LoggerEntry): Promise<void> {
    const directory = getLoggerDirectory(this.path, entry.timestamp, entry.timeZone);
    const line = `${formatLoggerFileEntry(entry)}\n`;

    await mkdir(directory, {
      recursive: true
    });

    const tasks: Promise<void>[] = [];

    if (this.writeAll) {
      tasks.push(this.writeToFile('all', entry, line));
    }

    if (this.splitByLevel) {
      tasks.push(this.writeToFile(entry.level, entry, line));
    }

    await Promise.all(tasks);
  }

  /**
   * Escribe una línea en el archivo correspondiente.
   */
  private async writeToFile(
    level: LoggerLevel | 'all',
    entry: LoggerEntry,
    line: string
  ): Promise<void> {
    const filePath = getLoggerFilePath(
      this.path,
      this.appName,
      level,
      entry.timestamp,
      entry.timeZone
    );

    await appendFile(filePath, line, 'utf-8');
  }
}
