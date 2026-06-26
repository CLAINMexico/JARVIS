import type {
  LoggerContext
} from '../contracts/logger-contract-context.js';

/**
 * Normaliza un error para que pueda imprimirse de forma segura dentro
 * del contexto del logger.
 *
 * Las instancias de Error normalmente no se serializan bien con
 * JSON.stringify(), por eso se extraen sus propiedades principales.
 *
 * Si el valor recibido no es una instancia de Error, se devuelve tal como
 * llegó para permitir objetos personalizados u otros valores capturados.
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
 * - module no se imprime como metadata porque ya aparece en el encabezado
 *   principal del log.
 * - error se normaliza para evitar salidas vacías o poco útiles.
 * - El resto del contexto se conserva como metadata adicional.
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
 * Si no existe metadata útil después de normalizar el contexto, devuelve
 * undefined para que el formatter solo imprima la línea principal del log.
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
