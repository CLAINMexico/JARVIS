import { JarvisApplication } from './runtime/jarvis-application.js';

import type { JarvisInfo } from './contracts/jarvis-info.js';
import type { JarvisOptions } from './contracts/jarvis-options.js';

export type { JarvisInfo } from './contracts/jarvis-info.js';

export type {
  JarvisModuleInfo,
  JarvisModuleOptions,
  JarvisModuleStatus
} from './contracts/jarvis-module.js';

export type {
  JarvisAppOptions,
  JarvisEnvironment,
  JarvisOptions,
  JarvisServerOptions
} from './contracts/jarvis-options.js';

export { JarvisApplication } from './runtime/jarvis-application.js';

export class Jarvis {
  public static async boot(options: JarvisOptions): Promise<JarvisApplication> {
    const app = new JarvisApplication(options);

    return app;
  }

  public static about(): Pick<JarvisInfo, 'name' | 'description'> {
    return {
      name: 'J.A.R.V.I.S.',
      description: 'JavaScript Architecture Runtime for Versatile Intelligent Services'
    };
  }
}
