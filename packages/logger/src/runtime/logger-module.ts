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
 * Módulo vivo de logger para J.A.R.V.I.S.
 *
 * Expone LoggerService como service para que @jarvis/core
 * pueda registrarlo y permitir su consulta mediante core.service('logger').
 */
export interface LoggerModule extends JarvisRuntimeModule {
  service: LoggerService;
}

/**
 * Crea un módulo vivo de logger.
 *
 * Este módulo configura los transports necesarios, crea LoggerService
 * y lo expone como service para el runtime.
 */
export function createLoggerModule(options: LoggerOptions = {}): LoggerModule {
  const appName = options.appName ?? 'JARVIS';
  const level = options.level ?? 'info';
  const defaultModule = options.defaultModule ?? 'Logger';
  const timeZone = options.timeZone ?? 'UTC';

  const transports: LoggerTransport[] = [];

  if (options.console?.enabled ?? true) {
    transports.push(
      new LoggerConsoleTransport({
        colors: options.console?.colors ?? true
      })
    );
  }

  if (options.file?.enabled ?? false) {
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
    },
    shutdown() {
    }
  };
}
