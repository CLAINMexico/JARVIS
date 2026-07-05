import type {
  ConfigService
} from '@jarvis/config';

import type {
  SecurityJwtOptions
} from '@jarvis/security';

/**
 * Convierte un valor desconocido de configuración en string.
 *
 * Si el valor no es string o viene vacío, devuelve el fallback recibido.
 */
function getSandboxSecurityString(
  value: unknown,
  fallback: string
): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return fallback;
  }

  return normalizedValue;
}

/**
 * Resuelve un valor de configuración que puede venir como placeholder.
 *
 * Ejemplo:
 * SETTINGS_SECURITY_JWT_SECRET
 *
 * Si existe una variable de entorno con ese nombre, devuelve su valor.
 * Si no existe, devuelve el valor original.
 */
function resolveSandboxSecurityEnvValue(value: string): string {
  const envValue = process.env[value];

  if (typeof envValue === 'string' && envValue.trim().length > 0) {
    return envValue;
  }

  return value;
}

/**
 * Resuelve las opciones JWT para @jarvis/security desde settings.json.
 *
 * Reglas oficiales:
 * - issuer queda fijo como J.A.R.V.I.S.
 * - audience se resuelve desde app.name.
 * - secret puede venir como placeholder de variable de entorno.
 */
export function resolveSandboxSecurityJwtOptions(
  config: ConfigService,
  appName: string
): SecurityJwtOptions {
  const rawSecret = getSandboxSecurityString(
    config.get('api.jwt.secret'),
    ''
  );

  const secret = resolveSandboxSecurityEnvValue(rawSecret);

  if (secret.length === 0) {
    throw new Error('Sandbox-API | api.jwt.secret no está configurado.');
  }

  const accessTokenExpiresIn = getSandboxSecurityString(
    config.get('api.jwt.accessTokenExpiresIn'),
    '15m'
  );

  const refreshTokenExpiresIn = getSandboxSecurityString(
    config.get('api.jwt.refreshTokenExpiresIn'),
    '7d'
  );

  const serviceTokenExpiresIn = getSandboxSecurityString(
    config.get('api.jwt.serviceTokenExpiresIn'),
    '1h'
  );

  return {
    secret,
    issuer: 'J.A.R.V.I.S.',
    audience: appName,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    serviceTokenExpiresIn
  };
}
