/**
 * Convierte un secreto de texto en bytes para operaciones criptográficas.
 *
 * jose trabaja con Uint8Array para algoritmos HMAC como HS256.
 */
export function encodeSecurityJwtSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/**
 * Valida que exista un secreto JWT usable.
 *
 * Se exige un valor no vacío para evitar firmar tokens con secretos inválidos
 * o accidentales.
 */
export function assertSecurityJwtSecret(secret: string): void {
  if (secret.trim().length === 0) {
    throw new Error('@jarvis/security | JWT secret no puede estar vacío.');
  }
}
