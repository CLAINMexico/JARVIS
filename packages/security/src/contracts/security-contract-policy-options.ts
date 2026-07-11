import type {
  SecurityJwtPayload
} from './security-contract-jwt-payload.js';

import type {
  SecurityPolicy
} from './security-contract-policy.js';

/**
 * Opciones para evaluar una policy contra un payload autenticado.
 */
export interface SecurityPolicyOptions {
  /**
   * Payload JWT previamente autenticado.
   */
  payload: SecurityJwtPayload;

  /**
   * Policy definida por la aplicación.
   */
  policy: SecurityPolicy;
}
