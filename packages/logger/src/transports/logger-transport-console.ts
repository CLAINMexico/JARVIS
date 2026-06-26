import type {
  LoggerEntry
} from '../contracts/logger-contract-entry.js';

import type {
  LoggerTransport
} from '../contracts/logger-contract-transport.js';

import {
  formatLoggerConsoleEntry
} from '../formatters/logger-formatter-console.js';

/**
 * Opciones del transport de consola.
 */
export interface LoggerConsoleTransportOptions {
  /**
   * Habilita o deshabilita colores ANSI en la salida de consola.
   */
  colors?: boolean;
}

/**
 * Transport encargado de escribir eventos de log en consola.
 *
 * Este transport recibe entradas normalizadas, las convierte a texto usando
 * el formatter de consola y después las envía al método de consola adecuado
 * según el nivel del evento.
 */
export class LoggerConsoleTransport implements LoggerTransport {
  /**
   * Indica si la salida en consola debe usar colores ANSI.
   */
  private readonly colors: boolean;

  /**
   * Crea una nueva instancia del transport de consola.
   */
  public constructor(options: LoggerConsoleTransportOptions = {}) {
    this.colors = options.colors ?? true;
  }

  /**
   * Escribe una entrada de log en consola.
   *
   * Los niveles error y fatal se envían a console.error().
   * El nivel warn se envía a console.warn().
   * Los demás niveles se envían a console.log().
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
