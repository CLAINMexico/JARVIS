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
   * Nombre de la aplicación usado para construir nombres de archivo.
   *
   * Ejemplo:
   * JARVIS_SANDBOXAPI
   */
  appName: string;

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
   * Cuando está activo, se crea o actualiza un archivo ALL con todos los
   * eventos procesados.
   */
  writeAll?: boolean;

  /**
   * Indica si los logs deben escribirse en archivos separados por nivel.
   *
   * Cuando está activo, se crean o actualizan archivos como DEBUG, INFO,
   * WARN, ERROR y FATAL según el nivel del evento.
   */
  splitByLevel?: boolean;
}

/**
 * Transport encargado de escribir eventos de log en archivos.
 *
 * Este transport recibe entradas normalizadas, las convierte a texto usando
 * el formatter de archivos y las escribe en la estructura de directorios
 * definida por las utilidades de path del logger.
 */
export class LoggerFileTransport implements LoggerTransport {
  /**
   * Nombre normalizado de la aplicación para nombres de archivo.
   */
  private readonly appName: string;

  /**
   * Ruta base donde se guardarán los logs.
   */
  private readonly path: string;

  /**
   * Indica si se debe escribir un archivo concentrado ALL.
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
    this.appName = options.appName;
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
   * - Archivo ALL, si writeAll está activo.
   * - Archivo por nivel, si splitByLevel está activo.
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
   *
   * El archivo final se resuelve a partir de la ruta base, el nombre de la
   * aplicación, el nivel del log, el timestamp y la zona horaria del evento.
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
