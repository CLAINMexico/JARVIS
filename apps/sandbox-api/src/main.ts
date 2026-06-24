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
 * inicial, registrar módulos y ejecutar módulos vivos del runtime.
 */
const core = await Jarvis.boot({
  app: {
    name: 'Sandbox API for development',
    version: '0.6.0',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  modules: [
    {
      name: 'license',
      status: 'disabled'
    }
  ],
  runtimeModules: [
    {
      name: 'config',
      boot() {
        console.log('[config] boot ejecutado');
      },
      shutdown() {
        console.log('[config] shutdown ejecutado');
      }
    },
    {
      name: 'logger',
      boot() {
        console.log('[logger] boot ejecutado');
      },
      shutdown() {
        console.log('[logger] shutdown ejecutado');
      }
    },
    {
      name: 'database',
      async boot() {
        console.log('[database] boot asíncrono ejecutado');
      },
      async shutdown() {
        console.log('[database] shutdown asíncrono ejecutado');
      }
    }
  ]
});

/**
 * Se ejecuta el arranque de los módulos vivos.
 *
 * Cada módulo que tenga método boot() será inicializado por el core.
 */
await core.bootModules();

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

/**
 * Se ejecuta el apagado de los módulos vivos.
 *
 * El core apagará los módulos en orden inverso al arranque.
 */
await core.shutdown();
