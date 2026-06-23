import type { JarvisInfo } from '../contracts/jarvis-info.js';
import type { JarvisModuleInfo } from '../contracts/jarvis-module.js';
import type { JarvisEnvironment, JarvisOptions } from '../contracts/jarvis-options.js';

interface NormalizedJarvisOptions {
  app: {
    name: string;
    version: string;
    environment: JarvisEnvironment;
  };
  server: {
    host: string;
    port: number;
  };
  modules: JarvisModuleInfo[];
}

export class JarvisApplication {
  private readonly options: NormalizedJarvisOptions;

  public constructor(options: JarvisOptions) {
    this.options = {
      app: {
        name: options.app.name,
        version: options.app.version,
        environment: options.app.environment ?? 'local'
      },
      server: {
        host: options.server?.host ?? '0.0.0.0',
        port: options.server?.port ?? 3000
      },
      modules: (options.modules ?? []).map((module) => ({
        name: module.name,
        status: module.status ?? 'registered'
      }))
    };
  }

  public info(): JarvisInfo {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services',
      app: {
        name: this.options.app.name,
        version: this.options.app.version,
        environment: this.options.app.environment
      },
      server: {
        host: this.options.server.host,
        port: this.options.server.port
      },
      modules: this.modules(),
      status: 'bootstrapped'
    };
  }

  public modules(): JarvisModuleInfo[] {
    return [...this.options.modules];
  }
}
