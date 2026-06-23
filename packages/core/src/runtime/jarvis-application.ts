import type { JarvisInfo } from '../contracts/jarvis-info.js';
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
      }
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
      status: 'bootstrapped'
    };
  }
}
