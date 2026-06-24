/**
 * Se importa el punto de entrada principal de @jarvis/core.
 *
 * Jarvis permite arrancar una instancia del runtime usando Jarvis.boot().
 */
import {
  Jarvis
} from '@jarvis/core';

/**
 * Se arranca una instancia de J.A.R.V.I.S. para pruebas de desarrollo.
 *
 * Esta aplicación no representa todavía una API real de negocio.
 * Su objetivo es validar que el core pueda bootear, recibir configuración
 * inicial y registrar módulos dentro del runtime.
 */
const core = await Jarvis.boot({
  app: {
    name: 'Sandbox API for development',
    version: '0.5.2',
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

/**
 * Se obtiene la información normalizada de la instancia arrancada.
 *
 * A partir de este punto, los valores opcionales ya fueron resueltos
 * por el core, por ejemplo environment, host, port y status de módulos.
 */
const instance = core.info();

console.log(`App: ${instance.name} | ${instance.app.name}`);
console.log(`Description: ${instance.description}`);
console.log(`Version: ${instance.app.version}`);
console.log(`Environment: ${instance.app.environment}`);
console.log(`Server: ${instance.server.host}:${instance.server.port}`);
console.log(`Status: ${instance.status}`);

console.log('Modules:');

/**
 * Se recorren los módulos reportados por la instancia.
 *
 * Esto valida que los módulos enviados a Jarvis.boot() fueron
 * registrados y normalizados correctamente.
 */
for (const module of instance.modules) {
  console.log(`- ${module.name}: ${module.status}`);
}
