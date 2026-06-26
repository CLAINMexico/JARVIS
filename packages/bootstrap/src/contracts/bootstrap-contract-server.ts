/**
 * Configuración normalizada del servidor.
 *
 * Esta estructura se entrega lista para usarse en Jarvis.boot().
 */
export interface BootstrapServer {
  /**
   * Host donde escuchará la aplicación.
   */
  host: string;

  /**
   * Puerto donde escuchará la aplicación.
   */
  port: number;
}
