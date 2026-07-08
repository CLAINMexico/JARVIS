/**
 * Contratos públicos de @jarvis/security.
 *
 * Estos types describen payloads, opciones de firma, resultados de
 * verificación y contratos de autenticación universal.
 */
export type {
  SecurityJwtMetadata,
  SecurityJwtPayload,
  SecurityJwtTokenType
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

export type {
  SecurityAuthBearerOptions,
  SecurityAuthServiceOptions
} from './contracts/security-contract-auth-options.js';

export type {
  SecurityAuthResult
} from './contracts/security-contract-auth-result.js';

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
 * Runtime principal de autenticación.
 *
 * SecurityAuthService permite autenticar tokens Bearer de forma universal,
 * sin depender de frameworks HTTP específicos.
 */
export {
  SecurityAuthService
} from './runtime/security-runtime-auth-service.js';

/**
 * Utilidades públicas para JWT.
 */
export {
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from './utils/security-util-jwt.js';

/**
 * Utilidades públicas para Bearer Auth.
 */
export {
  extractSecurityBearerToken
} from './utils/security-util-bearer-token.js';

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
