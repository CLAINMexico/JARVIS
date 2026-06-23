import { Jarvis } from '@jarvis/core';

const Core = await Jarvis.boot({
  app: {
    name: 'Sandbox API for development',
    version: '0.5.1',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  modules: [
    {
      name: 'config'
    },
    {
      name: 'logger'
    },
    {
      name: 'license',
      status: 'disabled'
    },
    {
      name: 'database'
    }
  ]
});

const Instance = Core.info();

console.log(`App: ${Instance.name} | ${Instance.app.name}`);
console.log(`Description: ${Instance.description}`);
console.log(`Version: ${Instance.app.version}`);
console.log(`Environment: ${Instance.app.environment}`);
console.log(`Server: ${Instance.server.host}:${Instance.server.port}`);
console.log(`Status: ${Instance.status}`);
console.log('Modules:');
for (const Module of Instance.modules) {
  console.log(`- ${Module.name}: ${Module.status}`);
}
