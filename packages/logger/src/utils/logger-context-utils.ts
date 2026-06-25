import type {
  LoggerContext
} from '../contracts/logger-context.js';

/**
 * Normaliza un error para que pueda imprimirse de forma segura
 * dentro del contexto del logger.
 *
 * Error normalmente no se serializa bien con JSON.stringify(),
 * por eso extraemos sus propiedades principales.
 */
function normalizeLoggerError(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return error;
}

/**
 * Indica si un objeto tiene propiedades propias.
 */
function hasObjectKeys(value: Record<string, unknown>): boolean {
  return Object.keys(value).length > 0;
}

/**
 * Prepara el contexto del logger para impresión.
 *
 * Reglas:
 * - module no se imprime como metadata porque ya aparece en el encabezado.
 * - error se normaliza para evitar [object Object] o `{}`.
 * - El resto del contexto se conserva como metadata.
 */
function normalizeLoggerContext(context: LoggerContext): Record<string, unknown> {
  const {
    module,
    error,
    ...metadata
  } = context;

  return {
    ...metadata,
    ...(error !== undefined
      ? {
        error: normalizeLoggerError(error)
      }
      : {})
  };
}

/**
 * Formatea el contexto adicional de un log como JSON legible.
 *
 * Si no existe metadata útil, devuelve undefined para que el formatter
 * solo imprima la línea principal del log.
 */
export function formatLoggerContext(context?: LoggerContext): string | undefined {
  if (!context) {
    return undefined;
  }

  const normalizedContext = normalizeLoggerContext(context);

  if (!hasObjectKeys(normalizedContext)) {
    return undefined;
  }

  return JSON.stringify(normalizedContext, null, 2);
}
