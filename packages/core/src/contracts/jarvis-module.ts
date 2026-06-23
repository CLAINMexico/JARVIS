export type JarvisModuleStatus = 'registered' | 'disabled' | 'error';

export interface JarvisModuleOptions {
  /**
   * Module unique name.
   *
   * Examples:
   * config
   * logger
   * database
   * security
   */
  name: string;

  /**
   * Module current status.
   *
   * Default:
   * registered
   */
  status?: JarvisModuleStatus;
}

export interface JarvisModuleInfo {
  name: string;
  status: JarvisModuleStatus;
}
