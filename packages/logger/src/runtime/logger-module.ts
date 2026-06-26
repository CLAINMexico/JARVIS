import type {
  JarvisRuntimeModule
} from '@jarvis/core';

import type {
  LoggerOptions
} from '../contracts/logger-options.js';

import type {
  LoggerTransport
} from '../contracts/logger-transport.js';

import {
  LoggerConsoleTransport
} from '../transports/logger-console-transport.js';

import {
  LoggerFileTransport
} from '../transports/logger-file-transport.js';

import {
  LoggerService
} from './logger-service.js';

/**
 * Define el módulo vivo de logger compatible con @jarvis/core.
 */
export interface LoggerModule extends JarvisRuntimeModule {
  name: 'logger';
  service: LoggerService;
}

/**
 * Crea el módulo real de logger para integrarlo al runtime de J.A.R.V.I.S.
 *
 * Cuando options.enabled es false, el servicio se sigue creando para que
 * otros packages puedan solicitar core.service('logger') sin romper flujo,
 * pero no se registran transports ni se escriben mensajes de boot/shutdown.
 */
export function createLoggerModule(options: LoggerOptions = {}): LoggerModule {
  const enabled = options.enabled ?? true;
  const appName = options.appName ?? 'JARVIS';
  const level = options.level ?? 'info';
  const defaultModule = options.defaultModule ?? 'Logger';
  const timeZone = options.timeZone ?? 'UTC';

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

  const service = new LoggerService({
    level,
    defaultModule,
    timeZone,
    transports
  });

  return {
    name: 'logger',
    service,
    boot() {
      if (!enabled) {
        return;
      }
    },
    shutdown() {
      if (!enabled) {
        return;
      }
    }
  };
}
