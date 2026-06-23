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
  }
});

const info = J.info();

console.log(`${info.name} | ${info.app.name}`);
console.log(info.description);
console.log(`Version: ${info.app.version}`);
console.log(`Environment: ${info.app.environment}`);
console.log(`Server: ${info.server.host}:${info.server.port}`);
console.log(`Status: ${info.status}`);
