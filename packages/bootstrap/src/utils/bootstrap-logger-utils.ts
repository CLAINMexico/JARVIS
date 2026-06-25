/**
 * Normaliza el nombre de una aplicación para usarlo como parte
 * del nombre de archivos de log.
 *
 * Ejemplos:
 * - Sandbox API -> JARVIS_SANDBOX_API
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
 * Normaliza el nombre del módulo por defecto para logs de aplicación.
 *
 * Este nombre aparece dentro del formato:
 *
 * [LEVEL] YYYY-MM-DD HH:mm:ss | [Module] Mensaje
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
