import type {
  JarvisEnvironment
} from '@jarvis/core';

import type {
  LoggerLevel
} from '@jarvis/logger';

/**
 * Convierte un valor desconocido a string.
 *
 * Si el valor recibido no es string o viene vacío, se devuelve
 * el valor por defecto.
 */
export function getBootstrapString(value: unknown, defaultValue: string): string {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return defaultValue;
  }

  return normalizedValue;
}

/**
 * Convierte un valor desconocido a number.
 *
 * Si el valor recibido no es number válido, se devuelve
 * el valor por defecto.
 */
export function getBootstrapNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return defaultValue;
}

/**
 * Convierte un valor desconocido a boolean.
 *
 * Acepta booleanos reales y strings comunes como:
 * true, false, 1, 0, yes, no.
 */
export function getBootstrapBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'y', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'n', 'off'].includes(normalizedValue)) {
    return false;
  }

  return defaultValue;
}

/**
 * Normaliza el ambiente de ejecución de J.A.R.V.I.S.
 *
 * Si el valor recibido no coincide con un ambiente soportado,
 * se devuelve local.
 */
export function getBootstrapEnvironment(value: unknown): JarvisEnvironment {
  const normalizedValue = getBootstrapString(value, 'local');

  if (
    normalizedValue === 'local' ||
    normalizedValue === 'development' ||
    normalizedValue === 'staging' ||
    normalizedValue === 'production' ||
    normalizedValue === 'testing'
  ) {
    return normalizedValue;
  }

  return 'local';
}

/**
 * Normaliza el nivel mínimo del logger.
 *
 * Si el valor recibido no coincide con un nivel soportado,
 * se devuelve info.
 */
export function getBootstrapLoggerLevel(value: unknown): LoggerLevel {
  const normalizedValue = getBootstrapString(value, 'info');

  if (
    normalizedValue === 'debug' ||
    normalizedValue === 'info' ||
    normalizedValue === 'warn' ||
    normalizedValue === 'error' ||
    normalizedValue === 'fatal'
  ) {
    return normalizedValue;
  }

  return 'info';
}
