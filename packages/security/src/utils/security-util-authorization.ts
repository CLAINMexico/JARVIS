import type {
  SecurityAuthorizationMode
} from '../contracts/security-contract-authorization-mode.js';

/**
 * Normaliza una lista de valores de autorización.
 */
export function normalizeSecurityAuthorizationValues(
  values: string[] | undefined
): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

/**
 * Evalúa si una lista origen cumple con los valores requeridos.
 */
export function matchSecurityAuthorizationValues(
  sourceValues: string[],
  requiredValues: string[],
  mode: SecurityAuthorizationMode
): boolean {
  if (requiredValues.length === 0) {
    return true;
  }

  const source = new Set(sourceValues);

  if (mode === 'any') {
    return requiredValues.some((value) => source.has(value));
  }

  return requiredValues.every((value) => source.has(value));
}
