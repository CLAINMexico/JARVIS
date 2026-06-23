import type { JarvisModuleInfo } from './jarvis-module.js';
import type { JarvisEnvironment } from './jarvis-options.js';

export interface JarvisAppInfo {
  name: string;
  version: string;
  environment: JarvisEnvironment;
}

export interface JarvisServerInfo {
  host: string;
  port: number;
}

export interface JarvisInfo {
  name: 'J.A.R.V.I.S.';
  description: 'JavaScript Architecture Runtime for Versatile Intelligent Services';
  app: JarvisAppInfo;
  server: JarvisServerInfo;
  modules: JarvisModuleInfo[];
  status: 'bootstrapped';
}
