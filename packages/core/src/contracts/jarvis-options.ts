import type { JarvisModuleOptions } from './jarvis-module.js';

export type JarvisEnvironment = 'local' | 'development' | 'testing' | 'staging' | 'production';

export interface JarvisAppOptions {
  /**
   * Application display name.
   *
   * Example:
   * J.A.R.V.I.S. Sandbox API
   */
  name: string;

  /**
   * Application semantic version.
   *
   * Example:
   * 0.1.0
   */
  version: string;

  /**
   * Current application environment.
   *
   * Default:
   * local
   */
  environment?: JarvisEnvironment;
}

export interface JarvisServerOptions {
  /**
   * Server host.
   *
   * Default:
   * 0.0.0.0
   */
  host?: string;

  /**
   * Server port.
   *
   * Default:
   * 3000
   */
  port?: number;
}

export interface JarvisOptions {
  /**
   * Main application information.
   */
  app: JarvisAppOptions;

  /**
   * Server configuration.
   */
  server?: JarvisServerOptions;

  /**
   * Initial modules registered in the runtime.
   */
  modules?: JarvisModuleOptions[];
}
