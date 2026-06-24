/**
 * Se importa el punto de entrada principal de @jarvis/core.
 *
 * Jarvis permite arrancar una instancia del runtime usando Jarvis.boot().
 */
import {
  Jarvis
} from '@jarvis/core';

/**
 * Se importa el factory principal de @jarvis/config.
 *
 * createConfigModule() permite crear un módulo vivo de configuración,
 * compatible con el ciclo de vida definido por @jarvis/core.
 */
import {
  createConfigModule
} from '@jarvis/config';

/**
 * Se crea el módulo real de configuración.
 *
 * En este sandbox, @jarvis/config leerá el archivo settings.json
 * de la aplicación durante su método boot().
 *
 * Importante:
 * - settings.json contiene configuración no sensible.
 * - settings.json puede tener referencias hacia variables del .env.
 * - El archivo settings.json real no debe subirse a Git.
 */
const configModule = createConfigModule({
  file: './settings.json'
});

/**
 * Se arranca una instancia de J.A.R.V.I.S. para pruebas de desarrollo.
 *
 * Esta aplicación no representa todavía una API real de negocio.
 * Su objetivo es validar que el core pueda bootear, recibir configuración
 * inicial, registrar módulos y ejecutar módulos vivos del runtime.
 *
 * En esta prueba, @jarvis/config ya no es un módulo falso: es un package
 * real montado por el core mediante runtimeModules.
 */
const core = await Jarvis.boot({
  app: {
    name: 'Sandbox API for development',
    version: '1.0.0',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeModules: [
    configModule
  ]
});

/**
 * Se ejecuta el arranque de los módulos vivos.
 *
 * Cada módulo que tenga método boot() será inicializado por el core.
 * En este caso, @jarvis/config leerá settings.json y cargará sus valores
 * dentro de ConfigService.
 */
await core.bootModules();

/**
 * Se obtiene la información normalizada de la instancia arrancada.
 *
 * A partir de este punto, los valores opcionales ya fueron resueltos
 * por el core, por ejemplo environment, host, port y status de módulos.
 */
const instance = core.info();

/**
 * Se imprime información general del runtime.
 *
 * Esta sección valida que @jarvis/core sigue bootstrapped correctamente
 * después de montar el módulo real @jarvis/config.
 */
console.log('================================================================================');
console.log(`- App: ${instance.name} | ${instance.app.name}`);
console.log(`- Description: ${instance.description}`);
console.log(`- Version: ${instance.app.version}`);
console.log(`- Environment: ${instance.app.environment}`);
console.log('================================================================================');
console.log(`- Server: ${instance.server.host}:${instance.server.port}`);
console.log(`- Status: ${instance.status}`);
console.log('================================================================================');

/**
 * Se imprime la configuración cargada por @jarvis/config.
 *
 * configModule.service.all() devuelve la configuración completa que fue
 * cargada desde settings.json durante boot().
 *
 * Nota:
 * Esta salida es útil para el sandbox, pero en una app real no se debe
 * imprimir configuración completa si contiene datos sensibles o referencias
 * que no deban exponerse en logs.
 */
console.log('- Package - Config | settings.json:');
console.log(configModule.service.all());

/**
 * Se ejecuta el apagado de los módulos vivos.
 *
 * El core apagará los módulos en orden inverso al arranque.
 * En este caso, ejecutará shutdown() de @jarvis/config.
 */
await core.shutdown();
