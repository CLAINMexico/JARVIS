/**
 * Contratos públicos de JWT.
 *
 * Estos types describen el payload JWT, opciones de configuración,
 * opciones de firma y resultado normalizado de verificación.
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

/**
 * Contratos públicos de Bearer Auth.
 *
 * Estos types describen las opciones y el resultado de autenticación
 * universal mediante headers Authorization Bearer.
 */
export type {
  SecurityAuthBearerOptions,
  SecurityAuthServiceOptions
} from './contracts/security-contract-auth-options.js';

export type {
  SecurityAuthResult
} from './contracts/security-contract-auth-result.js';

/**
 * Contratos públicos de Authorization.
 *
 * Estos types describen la validación universal de roles y permisos
 * sobre un payload previamente autenticado.
 */
export type {
  SecurityAuthorizationMode
} from './contracts/security-contract-authorization-mode.js';

export type {
  SecurityAuthorizationOptions
} from './contracts/security-contract-authorization-options.js';

export type {
  SecurityAuthorizationResult
} from './contracts/security-contract-authorization-result.js';

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
 * Runtime principal de Bearer Auth.
 *
 * SecurityAuthService permite autenticar tokens Bearer de forma universal,
 * sin depender de frameworks HTTP específicos.
 */
export {
  SecurityAuthService
} from './runtime/security-runtime-auth-service.js';

/**
 * Runtime principal de Authorization.
 *
 * SecurityAuthorizationService permite validar roles y permisos presentes
 * en un payload autenticado, sin consultar base de datos y sin depender de
 * frameworks HTTP específicos.
 */
export {
  SecurityAuthorizationService
} from './runtime/security-runtime-authorization-service.js';

/**
 * Utilidades públicas para JWT.
 *
 * Estas utilidades permiten validar y codificar el secret usado para firmar
 * y verificar tokens JWT.
 */
export {
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from './utils/security-util-jwt.js';

/**
 * Utilidades públicas para Bearer Auth.
 *
 * Esta utilidad permite extraer y validar el token desde un header
 * Authorization con esquema Bearer.
 */
export {
  extractSecurityBearerToken
} from './utils/security-util-bearer-token.js';

/**
 * Utilidades públicas para Authorization.
 *
 * Estas utilidades permiten normalizar valores de autorización y evaluar
 * coincidencias entre roles o permisos disponibles contra roles o permisos
 * requeridos.
 */
export {
  matchSecurityAuthorizationValues,
  normalizeSecurityAuthorizationValues
} from './utils/security-util-authorization.js';

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
