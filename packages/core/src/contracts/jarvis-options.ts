import type { JarvisModuleOptions } from './jarvis-module.js';

export type JarvisEnvironment = 'local' | 'development' | 'testing' | 'staging' | 'production';

export interface JarvisAppOptions {
  name: string;
  version: string;
  environment?: JarvisEnvironment;
}

export interface JarvisServerOptions {
  host?: string;
  port?: number;
}

export interface JarvisOptions {
  app: JarvisAppOptions;
  server?: JarvisServerOptions;
  modules?: JarvisModuleOptions[];
}
