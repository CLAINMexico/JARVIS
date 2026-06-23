export type JarvisModuleStatus = 'registered' | 'disabled' | 'error';

export interface JarvisModuleOptions {
  name: string;
  status?: JarvisModuleStatus;
}

export interface JarvisModuleInfo {
  name: string;
  status: JarvisModuleStatus;
}
