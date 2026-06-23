import { Jarvis } from '@jarvis/core';

const J = await Jarvis.boot({
  app: {
    name: 'J.A.R.V.I.S. Sandbox API',
    version: '0.1.0',
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

const info = J.info();

console.log(`${info.name} | ${info.app.name}`);
console.log(info.description);
console.log(`Version: ${info.app.version}`);
console.log(`Environment: ${info.app.environment}`);
console.log(`Server: ${info.server.host}:${info.server.port}`);
console.log(`Status: ${info.status}`);

console.log('Modules:');

for (const module of J.modules()) {
  console.log(`- ${module.name}: ${module.status}`);
}
