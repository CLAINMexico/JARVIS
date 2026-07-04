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
  SecurityJwtPayload
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
 * En v0.18.0 solo se implementa JWT inicial. Login, refresh tokens,
 * sesiones, roles y permisos formales se integrarán en versiones posteriores.
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
   * Tiempo de expiración por defecto.
   */
  private readonly accessTokenExpiresIn: string;

  /**
   * Crea una nueva instancia del servicio JWT.
   */
  public constructor(options: SecurityJwtOptions) {
    assertSecurityJwtSecret(options.secret);

    this.secret = encodeSecurityJwtSecret(options.secret);
    this.issuer = options.issuer;
    this.audience = options.audience;
    this.accessTokenExpiresIn = options.accessTokenExpiresIn ?? '15m';
  }

  /**
   * Firma un payload y devuelve un token JWT.
   */
  public async sign(
    payload: SecurityJwtPayload,
    options: SecurityJwtSignOptions = {}
  ): Promise<string> {
    let token = new SignJWT({
      ...payload
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT'
      })
      .setSubject(payload.subject)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? this.accessTokenExpiresIn);

    const issuer = options.issuer ?? this.issuer;
    const audience = options.audience ?? this.audience;

    if (issuer) {
      token = token.setIssuer(issuer);
    }

    if (audience) {
      token = token.setAudience(audience);
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

      const payload = result.payload as SecurityJwtPayload;

      if (typeof payload.subject !== 'string' || payload.subject.length === 0) {
        throw unauthorized('Token JWT inválido: subject ausente.', {
          package: '@jarvis/security',
          event: 'security.jwt.subject.missing'
        });
      }

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
}
