import type {
  JarvisRuntimeModule
} from '@jarvis/core';

import type {
  LoggerOptions
} from '../contracts/logger-contract-options.js';

import type {
  LoggerTransport
} from '../contracts/logger-contract-transport.js';

import {
  LoggerConsoleTransport
} from '../transports/logger-transport-console.js';

import {
  LoggerFileTransport
} from '../transports/logger-transport-file.js';

import {
  LoggerService
} from './logger-runtime-service.js';

/**
 * Módulo vivo de logger compatible con @jarvis/core.
 *
 * Este módulo expone LoggerService como servicio público del runtime
 * para que pueda ser consultado mediante core.service('logger').
 */
export interface LoggerModule extends JarvisRuntimeModule {
  /**
   * Nombre fijo del módulo dentro del runtime.
   *
   * También funciona como llave para registrar y consultar el servicio.
   */
  name: 'logger';

  /**
   * Servicio público expuesto por el módulo.
   */
  service: LoggerService;
}

/**
 * Crea el módulo real de logger para integrarlo al runtime de J.A.R.V.I.S.
 *
 * Cuando options.enabled es false, el servicio se sigue creando para que
 * otros paquetes puedan solicitar core.service('logger') sin romper el flujo,
 * pero no se registran transports ni se escriben mensajes internos.
 *
 * Los transports se crean de forma condicional:
 * - console.enabled controla la salida en consola.
 * - file.enabled controla la salida en archivos.
 * - enabled controla el módulo completo como switch maestro.
 */
export function createLoggerModule(options: LoggerOptions = {}): LoggerModule {
  const enabled = options.enabled ?? true;
  const appName = options.appName ?? 'JARVIS';
  const level = options.level ?? 'info';
  const defaultModule = options.defaultModule ?? 'Logger';
  const timeZone = options.timeZone ?? 'UTC';

  /**
   * Lista de destinos donde LoggerService escribirá los eventos.
   *
   * Si el switch maestro enabled está apagado, esta lista permanece vacía
   * aunque console.enabled o file.enabled estén activos.
   */
  const transports: LoggerTransport[] = [];

  if (enabled && (options.console?.enabled ?? true)) {
    transports.push(
      new LoggerConsoleTransport({
        colors: options.console?.colors ?? true
      })
    );
  }

  if (enabled && (options.file?.enabled ?? false)) {
    transports.push(
      new LoggerFileTransport({
        appName,
        path: options.file?.path ?? './logs',
        splitByLevel: options.file?.splitByLevel ?? true,
        writeAll: options.file?.writeAll ?? true
      })
    );
  }

  /**
   * Se crea siempre el servicio de logger.
   *
   * Esto permite que el runtime conserve disponible core.service('logger'),
   * incluso cuando el logger esté deshabilitado por configuración.
   */
  const service = new LoggerService({
    level,
    defaultModule,
    timeZone,
    transports
  });

  return {
    name: 'logger',
    service,

    /**
     * Mantiene compatibilidad con el ciclo de vida del runtime.
     *
     * Actualmente no escribe mensajes internos durante boot(), pero el método
     * queda disponible para futuras tareas controladas de inicialización.
     */
    boot() {
      if (!enabled) {
        return;
      }
    },

    /**
     * Mantiene compatibilidad con el ciclo de vida del runtime.
     *
     * Actualmente no libera recursos externos durante shutdown(), pero el
     * método queda disponible para futuras tareas controladas de apagado.
     */
    shutdown() {
      if (!enabled) {
        return;
      }
    }
  };
}
