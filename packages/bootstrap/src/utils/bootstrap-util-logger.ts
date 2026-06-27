/**
 * Construye el nombre normalizado de la aplicación para archivos de log.
 *
 * Este valor se usa como parte del nombre físico de los archivos generados
 * por @jarvis/logger, por lo que debe evitar espacios, símbolos especiales
 * o caracteres que puedan generar rutas inconsistentes.
 *
 * Reglas:
 * - Elimina espacios al inicio y al final.
 * - Convierte el nombre a mayúsculas.
 * - Reemplaza espacios internos por guiones bajos.
 * - Elimina caracteres que no sean letras, números o guiones bajos.
 * - Agrega el prefijo JARVIS_ cuando no exista.
 *
 * Ejemplos:
 * - Sandbox-API -> JARVIS_SANDBOX_API
 * - SandboxAPI -> JARVIS_SANDBOXAPI
 * - My App -> JARVIS_MY_APP
 */
export function buildBootstrapLoggerAppName(appName: string): string {
  const normalizedAppName = appName
    .trim()
    .toUpperCase()
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^A-Z0-9_]/g, '');

  if (normalizedAppName.length === 0) {
    return 'JARVIS';
  }

  if (normalizedAppName.startsWith('JARVIS_')) {
    return normalizedAppName;
  }

  if (normalizedAppName === 'JARVIS') {
    return normalizedAppName;
  }

  return `JARVIS_${normalizedAppName}`;
}

/**
 * Construye el nombre del módulo por defecto para logs de aplicación.
 *
 * Este valor no se usa para nombres de archivo. Se usa como etiqueta visible
 * dentro de cada mensaje generado por @jarvis/logger cuando no se especifica
 * un módulo concreto.
 *
 * Formato esperado:
 *
 * [LEVEL] YYYY-MM-DD HH:mm:ss | [Module] Mensaje
 *
 * Ejemplo:
 * J.A.R.V.I.S. | SandboxAPI
 */
export function buildBootstrapLoggerDefaultModule(appName: string): string {
  const normalizedAppName = appName
    .trim()
    .replaceAll(/\s+/g, '');

  if (normalizedAppName.length === 0) {
    return 'App';
  }

  return `J.A.R.V.I.S. | ${normalizedAppName}`;
}
