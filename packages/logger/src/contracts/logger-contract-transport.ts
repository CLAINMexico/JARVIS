import type {
  LoggerEntry
} from './logger-contract-entry.js';

/**
 * Contrato base para salidas de log.
 *
 * Un transport representa un destino de escritura para eventos de log,
 * por ejemplo consola, archivos, base de datos, HTTP u otros destinos
 * que se agreguen en el futuro.
 *
 * El transport recibe eventos ya normalizados como LoggerEntry.
 */
export interface LoggerTransport {
  /**
   * Escribe un evento de log en el destino correspondiente.
   *
   * La implementación puede ser síncrona o asíncrona, dependiendo del tipo
   * de salida. Por ejemplo, consola puede escribir de forma inmediata,
   * mientras que archivos o destinos externos pueden requerir operaciones async.
   */
  write(entry: LoggerEntry): Promise<void> | void;
}
