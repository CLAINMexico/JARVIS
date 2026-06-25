/**
 * Representa un módulo vivo dentro del runtime de J.A.R.V.I.S.
 *
 * Un módulo vivo puede participar en el ciclo de vida del core mediante
 * boot() y shutdown().
 *
 * También puede exponer un servicio para que el core lo registre y pueda
 * ser consultado por la aplicación.
 */
export interface JarvisRuntimeModule {
  /**
   * Nombre único del módulo dentro del runtime.
   *
   * Este nombre también se usa como llave para registrar el servicio
   * cuando el módulo expone la propiedad service.
   */
  name: string;

  /**
   * Servicio expuesto por el módulo.
   *
   * Este valor es opcional porque no todos los módulos necesitan exponer
   * un servicio consultable desde la app.
   */
  service?: unknown;

  /**
   * Método opcional de arranque del módulo.
   *
   * Se ejecuta cuando el core llama bootModules().
   */
  boot?(): Promise<void> | void;

  /**
   * Método opcional de apagado del módulo.
   *
   * Se ejecuta cuando el core llama shutdown().
   */
  shutdown?(): Promise<void> | void;
}
