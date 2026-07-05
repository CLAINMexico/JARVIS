import {
  jwtVerify,
  SignJWT
} from 'jose';

import {
  unauthorized
} from '@jarvis/http';

import type {
  SecurityJwtOptions
} from '../contracts/security-contract-jwt-options.js';

import type {
  SecurityJwtPayload,
  SecurityJwtTokenType
} from '../contracts/security-contract-jwt-payload.js';

import type {
  SecurityJwtSignOptions
} from '../contracts/security-contract-jwt-sign-options.js';

import type {
  SecurityJwtVerifyResult
} from '../contracts/security-contract-jwt-verify-result.js';

import {
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from '../utils/security-util-jwt.js';

/**
 * Servicio JWT inicial de @jarvis/security.
 *
 * Este servicio concentra las operaciones básicas para firmar y verificar
 * tokens JWT dentro del ecosistema J.A.R.V.I.S.
 *
 * En v0.18.1 se complementa el soporte inicial agregando tokenType y
 * expiración por tipo de token.
 */
export class SecurityJwtService {
  /**
   * Secreto codificado para firmar y verificar tokens.
   */
  private readonly secret: Uint8Array;

  /**
   * Emisor por defecto de los tokens.
   */
  private readonly issuer: string | undefined;

  /**
   * Audiencia por defecto de los tokens.
   */
  private readonly audience: string | undefined;

  /**
   * Tiempo de expiración por defecto para access tokens.
   */
  private readonly accessTokenExpiresIn: string;

  /**
   * Tiempo de expiración por defecto para refresh tokens.
   */
  private readonly refreshTokenExpiresIn: string;

  /**
   * Tiempo de expiración por defecto para service tokens.
   */
  private readonly serviceTokenExpiresIn: string;

  /**
   * Crea una nueva instancia del servicio JWT.
   */
  public constructor(options: SecurityJwtOptions) {
    assertSecurityJwtSecret(options.secret);

    this.secret = encodeSecurityJwtSecret(options.secret);
    this.issuer = options.issuer;
    this.audience = options.audience;
    this.accessTokenExpiresIn = options.accessTokenExpiresIn ?? '15m';
    this.refreshTokenExpiresIn = options.refreshTokenExpiresIn ?? '7d';
    this.serviceTokenExpiresIn = options.serviceTokenExpiresIn ?? '1h';
  }

  /**
   * Firma un payload y devuelve un token JWT.
   */
  public async sign(
    payload: SecurityJwtPayload,
    options: SecurityJwtSignOptions = {}
  ): Promise<string> {
    this.assertPayload(payload);

    let token = new SignJWT({
      ...payload
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT'
      })
      .setSubject(payload.subject)
      .setIssuedAt()
      .setExpirationTime(
        options.expiresIn ?? this.resolveExpiresIn(payload.tokenType)
      );

    if (this.issuer) {
      token = token.setIssuer(this.issuer);
    }

    if (this.audience) {
      token = token.setAudience(this.audience);
    }

    return token.sign(this.secret);
  }

  /**
   * Verifica un token JWT y devuelve su payload normalizado.
   *
   * Si el token es inválido, expiró o no coincide con issuer/audience,
   * se lanza un error HTTP 401 usando @jarvis/http.
   */
  public async verify(token: string): Promise<SecurityJwtVerifyResult> {
    if (token.trim().length === 0) {
      throw unauthorized('Token JWT ausente.', {
        package: '@jarvis/security',
        event: 'security.jwt.missing'
      });
    }

    try {
      const result = await jwtVerify(token, this.secret, {
        ...(this.issuer ? { issuer: this.issuer } : {}),
        ...(this.audience ? { audience: this.audience } : {})
      });

      const payload = result.payload as unknown as SecurityJwtPayload;

      this.assertPayload(payload);

      return {
        payload,
        ...(typeof result.payload.iat === 'number' ? { issuedAt: result.payload.iat } : {}),
        ...(typeof result.payload.exp === 'number' ? { expiresAt: result.payload.exp } : {}),
        ...(typeof result.payload.iss === 'string' ? { issuer: result.payload.iss } : {}),
        ...(result.payload.aud !== undefined ? { audience: result.payload.aud } : {})
      };
    } catch (error: unknown) {
      throw unauthorized('Token JWT inválido o expirado.', {
        package: '@jarvis/security',
        event: 'security.jwt.invalid',
        error
      });
    }
  }

  /**
   * Resuelve la expiración por defecto según el tipo de token.
   */
  private resolveExpiresIn(tokenType: SecurityJwtTokenType): string {
    if (tokenType === 'refresh') {
      return this.refreshTokenExpiresIn;
    }

    if (tokenType === 'service') {
      return this.serviceTokenExpiresIn;
    }

    return this.accessTokenExpiresIn;
  }

  /**
   * Valida que el payload tenga la estructura mínima esperada.
   *
   * Esta validación se ejecuta antes de firmar y después de verificar para
   * evitar tokens incompletos o mal formados.
   */
  private assertPayload(payload: SecurityJwtPayload): void {
    if (typeof payload.subject !== 'string' || payload.subject.trim().length === 0) {
      throw unauthorized('Token JWT inválido: subject ausente.', {
        package: '@jarvis/security',
        event: 'security.jwt.subject.missing'
      });
    }

    if (!this.isTokenType(payload.tokenType)) {
      throw unauthorized('Token JWT inválido: tokenType no soportado.', {
        package: '@jarvis/security',
        event: 'security.jwt.tokenType.invalid'
      });
    }
  }

  /**
   * Valida si un valor pertenece a los tipos de token soportados.
   */
  private isTokenType(value: unknown): value is SecurityJwtTokenType {
    return value === 'access' || value === 'refresh' || value === 'service';
  }
}
