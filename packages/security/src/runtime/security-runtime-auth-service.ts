import {
  forbidden
} from '@jarvis/http';

import type {
  SecurityAuthBearerOptions,
  SecurityAuthServiceOptions
} from '../contracts/security-contract-auth-options.js';

import type {
  SecurityAuthResult
} from '../contracts/security-contract-auth-result.js';

import {
  extractSecurityBearerToken
} from '../utils/security-util-bearer-token.js';

/**
 * Servicio universal de autenticación de @jarvis/security.
 */
export class SecurityAuthService {
  private readonly jwt: SecurityAuthServiceOptions['jwt'];

  constructor(options: SecurityAuthServiceOptions) {
    this.jwt = options.jwt;
  }

  /**
   * Autentica una solicitud usando Authorization Bearer.
   */
  async authenticateBearer(
    options: SecurityAuthBearerOptions
  ): Promise<SecurityAuthResult> {
    const token = extractSecurityBearerToken(
      options.authorizationHeader
    );

    const result = await this.jwt.verify(token);

    const allowedTokenTypes = options.allowedTokenTypes ?? [
      'access'
    ];

    if (!allowedTokenTypes.includes(result.payload.tokenType)) {
      throw forbidden('Token JWT no autorizado para esta operación.', {
        package: '@jarvis/security',
        event: 'security.auth.tokenType.forbidden',
        tokenType: result.payload.tokenType,
        allowedTokenTypes
      });
    }

    return {
      token,
      payload: result.payload
    };
  }
}
