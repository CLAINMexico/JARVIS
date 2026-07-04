/**
 * Contratos públicos de @jarvis/security.
 *
 * Estos types describen payloads, opciones de firma y resultados de
 * verificación para tokens JWT.
 */
export type {
  SecurityJwtPayload
} from './contracts/security-contract-jwt-payload.js';

export type {
  SecurityJwtOptions
} from './contracts/security-contract-jwt-options.js';

export type {
  SecurityJwtSignOptions
} from './contracts/security-contract-jwt-sign-options.js';

export type {
  SecurityJwtVerifyResult
} from './contracts/security-contract-jwt-verify-result.js';

/**
 * Runtime principal de JWT.
 *
 * SecurityJwtService permite firmar y verificar tokens JWT dentro del
 * ecosistema J.A.R.V.I.S.
 */
export {
  SecurityJwtService
} from './runtime/security-runtime-jwt-service.js';

/**
 * Utilidades públicas para JWT.
 */
export {
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from './utils/security-util-jwt.js';

/**
 * Información pública del package @jarvis/security.
 *
 * Este objeto permite identificar el package desde pruebas, diagnósticos
 * o futuras herramientas internas del ecosistema J.A.R.V.I.S.
 */
export const JarvisSecurityPackage = {
  name: '@jarvis/security',
  description: 'J.A.R.V.I.S. | Package - Security'
} as const;
