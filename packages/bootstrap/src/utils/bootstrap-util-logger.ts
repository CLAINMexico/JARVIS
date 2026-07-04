/**
 * Construye el nombre visual de la aplicación para logs.
 *
 * Este valor se imprime dentro del formato homologado de @jarvis/logger:
 *
 * [YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] - MESSAGE
 *
 * Ya no se usa para construir nombres físicos de archivos.
 *
 * Ejemplos:
 * - Sandbox-API -> J.A.R.V.I.S. | Sandbox-API
 * - Sandbox API -> J.A.R.V.I.S. | Sandbox API
 * - App -> J.A.R.V.I.S. | App
 */
export function buildBootstrapLoggerAppName(appName: string): string {
  const normalizedAppName = appName
    .trim();

  if (normalizedAppName.length === 0) {
    return 'J.A.R.V.I.S. | App';
  }

  if (normalizedAppName.startsWith('J.A.R.V.I.S. |')) {
    return normalizedAppName;
  }

  return `J.A.R.V.I.S. | ${normalizedAppName}`;
}

/**
 * Construye el nombre del módulo por defecto para logs de aplicación.
 *
 * Este valor se conserva como contexto interno y fallback de compatibilidad.
 * La etiqueta visual principal ahora se resuelve mediante:
 *
 * - appName
 * - package
 *
 * dentro de @jarvis/logger.
 *
 * Ejemplos:
 * - Sandbox-API -> Sandbox-API
 * - Sandbox API -> Sandbox API
 * - App -> App
 */
export function buildBootstrapLoggerDefaultModule(appName: string): string {
  const normalizedAppName = appName
    .trim();

  if (normalizedAppName.length === 0) {
    return 'App';
  }

  return normalizedAppName;
}
