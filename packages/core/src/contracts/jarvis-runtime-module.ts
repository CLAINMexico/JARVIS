/**
 * Contrato base para un módulo vivo dentro del runtime de J.A.R.V.I.S.
 *
 * A diferencia de JarvisModuleOptions, este contrato no solo describe
 * información del módulo, sino también comportamiento opcional.
 *
 * Un JarvisRuntimeModule puede tener métodos de ciclo de vida como boot()
 * y shutdown(), los cuales serán ejecutados por el core cuando corresponda.
 */
export interface JarvisRuntimeModule {
  /**
   * Nombre único del módulo dentro del runtime.
   *
   * Ejemplos:
   * config
   * logger
   * database
   * security
   */
  name: string;

  /**
   * Arranca o inicializa el módulo.
   *
   * Este método es opcional porque no todos los módulos necesitan
   * lógica especial de arranque.
   *
   * Puede ser síncrono o asíncrono.
   */
  boot?(): Promise<void> | void;

  /**
   * Apaga o libera recursos usados por el módulo.
   *
   * Este método es opcional porque no todos los módulos necesitan
   * lógica especial de apagado.
   *
   * Puede ser síncrono o asíncrono.
   */
  shutdown?(): Promise<void> | void;
}
