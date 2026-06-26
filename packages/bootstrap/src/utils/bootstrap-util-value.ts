import type {
  JarvisEnvironment
} from '@jarvis/core';

import type {
  LoggerLevel
} from '@jarvis/logger';

/**
 * Obtiene un string seguro a partir de un valor desconocido.
 *
 * Se usa durante el bootstrap para normalizar valores leídos desde
 * settings.json antes de entregarlos al runtime.
 *
 * Si el valor recibido no es string o está vacío después de aplicar trim(),
 * se devuelve el valor por defecto.
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
 * Obtiene un number seguro a partir de un valor desconocido.
 *
 * Acepta números reales y strings que puedan convertirse a número.
 *
 * Si el valor recibido no puede convertirse a un número finito,
 * se devuelve el valor por defecto.
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
 * Obtiene un boolean seguro a partir de un valor desconocido.
 *
 * Acepta booleanos reales y strings comunes para representar valores
 * verdaderos o falsos.
 *
 * Valores verdaderos:
 * true, 1, yes, y, on
 *
 * Valores falsos:
 * false, 0, no, n, off
 *
 * Si el valor recibido no coincide con ninguna forma soportada,
 * se devuelve el valor por defecto.
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
 * Obtiene un ambiente seguro para el runtime de J.A.R.V.I.S.
 *
 * Solo permite ambientes soportados por @jarvis/core.
 *
 * Si el valor recibido no coincide con un ambiente permitido,
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
 * Obtiene un nivel seguro para @jarvis/logger.
 *
 * Solo permite niveles soportados por LoggerLevel.
 *
 * Si el valor recibido no coincide con un nivel permitido,
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
