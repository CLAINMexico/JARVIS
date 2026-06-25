import type {
  LoggerEntry
} from '../contracts/logger-entry.js';

import type {
  LoggerTransport
} from '../contracts/logger-transport.js';

import {
  formatLoggerConsoleEntry
} from '../formatters/logger-console-formatter.js';

/**
 * Opciones del transport de consola.
 */
export interface LoggerConsoleTransportOptions {
  /**
   * Habilita o deshabilita colores ANSI.
   */
  colors?: boolean;
}

/**
 * Transport encargado de escribir logs en consola.
 */
export class LoggerConsoleTransport implements LoggerTransport {
  private readonly colors: boolean;

  public constructor(options: LoggerConsoleTransportOptions = {}) {
    this.colors = options.colors ?? true;
  }

  /**
   * Escribe una entrada de log en consola.
   */
  public write(entry: LoggerEntry): void {
    const output = formatLoggerConsoleEntry(entry, this.colors);

    if (entry.level === 'error' || entry.level === 'fatal') {
      console.error(output);
      return;
    }

    if (entry.level === 'warn') {
      console.warn(output);
      return;
    }

    console.log(output);
  }
}
