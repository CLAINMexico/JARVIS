import {
  unauthorized
} from '@jarvis/http';

/**
 * Extrae un token Bearer desde el valor crudo del header Authorization.
 *
 * Esta utilidad es universal y no depende de ningún framework HTTP.
 */
export function extractSecurityBearerToken(
  authorizationHeader: string | null | undefined
): string {
  if (typeof authorizationHeader !== 'string' || authorizationHeader.trim().length === 0) {
    throw unauthorized('Authorization header ausente.', {
      package: '@jarvis/security',
      event: 'security.auth.authorization.missing'
    });
  }

  const parts = authorizationHeader.trim().split(/\s+/u);

  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    throw unauthorized('Authorization header inválido.', {
      package: '@jarvis/security',
      event: 'security.auth.authorization.invalid'
    });
  }

  const token = parts[1]?.trim() ?? '';

  if (token.length === 0) {
    throw unauthorized('Token JWT ausente.', {
      package: '@jarvis/security',
      event: 'security.auth.token.missing'
    });
  }

  return token;
}
