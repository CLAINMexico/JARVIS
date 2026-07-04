/**
 * Catálogo oficial de códigos de estado HTTP usados por J.A.R.V.I.S.
 *
 * Este objeto evita usar números mágicos dentro del ecosistema y permite que
 * los paquetes compartan una misma referencia para respuestas HTTP.
 */
export const HTTP_STATUS = {
  /**
   * La solicitud fue procesada correctamente.
   */
  OK: 200,

  /**
   * El recurso fue creado correctamente.
   */
  CREATED: 201,

  /**
   * La solicitud fue procesada correctamente, pero no hay contenido que devolver.
   */
  NO_CONTENT: 204,

  /**
   * La solicitud no es válida o no puede ser procesada por falta de datos,
   * formato incorrecto o parámetros inválidos.
   */
  BAD_REQUEST: 400,

  /**
   * La solicitud requiere autenticación o el token enviado no es válido.
   */
  UNAUTHORIZED: 401,

  /**
   * El usuario está autenticado, pero no tiene permisos para ejecutar
   * la acción solicitada.
   */
  FORBIDDEN: 403,

  /**
   * El recurso solicitado no existe o no está disponible.
   */
  NOT_FOUND: 404,

  /**
   * La solicitud entra en conflicto con el estado actual del recurso.
   */
  CONFLICT: 409,

  /**
   * La solicitud tiene una estructura válida, pero contiene datos que no
   * cumplen con las reglas esperadas.
   */
  UNPROCESSABLE_ENTITY: 422,

  /**
   * La solicitud fue rechazada porque se excedió un límite permitido.
   */
  TOO_MANY_REQUESTS: 429,

  /**
   * Error interno inesperado del servidor.
   */
  INTERNAL_SERVER_ERROR: 500,

  /**
   * El servicio no está disponible temporalmente.
   */
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * Tipo derivado con los códigos numéricos HTTP soportados por J.A.R.V.I.S.
 */
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
