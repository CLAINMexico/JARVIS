import type {
  LoggerEntry
} from './logger-entry.js';

/**
 * Contrato base para salidas de log.
 *
 * Un transport representa un destino de escritura:
 * consola, archivo, base de datos, HTTP, etc.
 */
export interface LoggerTransport {
  /**
   * Escribe un evento de log en el destino correspondiente.
   */
  write(entry: LoggerEntry): Promise<void> | void;
}
