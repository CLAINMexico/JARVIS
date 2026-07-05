import type {
  LoggerContext
} from '../contracts/logger-contract-context.js';

/**
 * Extrae un código estable desde un error cuando existe.
 *
 * Algunos errores controlados, como JarvisHttpError, exponen code como
 * propiedad pública. Este valor es útil para logs seguros no verbosos.
 */
function getLoggerErrorCode(error: Error): string | undefined {
  const errorWithCode = error as Error & {
    code?: unknown;
  };

  if (typeof errorWithCode.code === 'string') {
    return errorWithCode.code;
  }

  return undefined;
}

/**
 * Normaliza un error para que pueda imprimirse de forma segura dentro
 * del contexto del logger.
 *
 * Si verbose está activo, se incluye stack trace cuando exista.
 * Si verbose está apagado, solo se incluyen propiedades seguras:
 * name, message y code cuando exista.
 *
 * Si el valor recibido no es una instancia de Error, se devuelve tal como
 * llegó para permitir objetos personalizados u otros valores capturados.
 */
function normalizeLoggerError(
  error: unknown,
  verbose: boolean
): unknown {
  if (error instanceof Error) {
    const code = getLoggerErrorCode(error);

    return {
      name: error.name,
      message: error.message,
      ...(code !== undefined ? { code } : {}),
      ...(verbose && error.stack !== undefined ? { stack: error.stack } : {})
    };
  }

  return error;
}

/**
 * Indica si un objeto tiene propiedades propias.
 *
 * Se usa para evitar imprimir bloques de metadata vacíos cuando el contexto
 * no contiene información útil después de normalizarse.
 */
function hasObjectKeys(value: Record<string, unknown>): boolean {
  return Object.keys(value).length > 0;
}

/**
 * Prepara el contexto del logger para impresión.
 *
 * Reglas:
 * - package no se imprime como metadata porque ya aparece en el encabezado
 *   principal del log.
 * - module no se imprime como metadata porque se conserva dentro del entry
 *   normalizado y puede ser usado por transports o integraciones futuras.
 * - event no se imprime como metadata porque ya pertenece al entry
 *   normalizado.
 * - statusCode no se imprime como metadata porque ya aparece en la línea
 *   principal cuando existe.
 * - error se normaliza según verboseError.
 * - El resto del contexto se conserva como metadata adicional.
 */
function normalizeLoggerContext(
  context: LoggerContext,
  verboseError: boolean
): Record<string, unknown> {
  const {
    package: _package,
    module: _module,
    event: _event,
    statusCode: _statusCode,
    error,
    ...metadata
  } = context;

  return {
    ...metadata,
    ...(error !== undefined
      ? {
        error: normalizeLoggerError(
          error,
          verboseError
        )
      }
      : {})
  };
}

/**
 * Formatea el contexto adicional de un log como JSON legible.
 *
 * Si no existe metadata útil después de normalizar el contexto, devuelve
 * undefined para que el formatter solo imprima la línea principal del log.
 */
export function formatLoggerContext(
  context: LoggerContext | undefined,
  verboseError = false
): string | undefined {
  if (!context) {
    return undefined;
  }

  const normalizedContext = normalizeLoggerContext(
    context,
    verboseError
  );

  if (!hasObjectKeys(normalizedContext)) {
    return undefined;
  }

  return JSON.stringify(normalizedContext, null, 2);
}
