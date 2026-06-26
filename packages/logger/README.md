## @jarvis/logger

**`@jarvis/logger`** es el package oficial de logging del ecosistema **`J.A.R.V.I.S.`**

Este package permite registrar eventos del sistema en consola y archivos, usando niveles, módulos, contexto adicional, zona horaria y una estructura de logs ordenada por fecha.

---

## Objetivo

El objetivo de **`@jarvis/logger`** es centralizar la forma en que **`J.A.R.V.I.S.`** registra información técnica, eventos de arranque, advertencias, errores y datos útiles para diagnóstico.

En palabras simples:

```txt
@jarvis/logger es la bitácora oficial de J.A.R.V.I.S.
```

---

## Responsabilidades principales

**`@jarvis/logger`** se encarga de:

- Crear un módulo compatible con **`JarvisRuntimeModule`**.
- Exponer **`LoggerService`** como servicio del runtime.
- Registrar mensajes por nivel.
- Escribir logs en consola.
- Escribir logs en archivos.
- Crear archivo concentrado **`ALL.log`**.
- Crear archivos separados por nivel.
- Usar zona horaria configurable.
- Mantener el orden de escritura mediante una cola interna.
- Formatear contexto adicional como JSON legible.
- Normalizar errores para que puedan imprimirse correctamente.
- Permitir loggers hijos mediante **`child(module)`**.
- Respetar **`enabled: false`** como switch maestro del módulo.

---

## Switch maestro enabled

**`modules.logger.enabled`** controla el estado general del módulo logger.

Cuando está en **`true`**, el logger puede escribir en los transports habilitados.

Cuando está en **`false`**, el servicio logger sigue existiendo para que otros packages puedan solicitarlo sin romper el flujo:

```ts
const logger = core.service<LoggerService>('logger');
```

pero no escribe nada.

Comportamiento esperado:

```txt
enabled false
↓
LoggerService disponible
↓
sin consola
↓
sin archivos
↓
sin boot/shutdown
```

---

## Diferencia entre enabled del módulo y enabled de transports

```txt
modules.logger.enabled
```

Controla el logger completo.

```txt
modules.logger.console.enabled
```

Controla unicamente la salida a consola.

```txt
modules.logger.file.enabled
```

Controla unicamente la salida a archivos.

Tabla de comportamiento:

```txt
logger.enabled | console.enabled | file.enabled | consola | archivos | servicio
true           | true            | true         | si      | si       | si
true           | false           | true         | no      | si       | si
true           | true            | false        | si      | no       | si
true           | false           | false        | no      | no       | si
false          | true            | true         | no      | no       | si
false          | false           | false        | no      | no       | si
```

---

## Uso basico

```ts
import {
  createLoggerModule
} from '@jarvis/logger';

const loggerModule = createLoggerModule({
  enabled: true,
  appName: 'JARVIS_SANDBOXAPI',
  level: 'debug',
  defaultModule: 'SandboxAPI',
  timeZone: 'America/Mexico_City',
  console: {
    enabled: true,
    colors: true
  },
  file: {
    enabled: true,
    path: './logs',
    splitByLevel: true,
    writeAll: true
  }
});

loggerModule.service.info('Logger inicializado');
```

---

## Uso con logger apagado

```ts
const loggerModule = createLoggerModule({
  enabled: false,
  appName: 'JARVIS_SANDBOXAPI',
  level: 'debug',
  defaultModule: 'SandboxAPI',
  timeZone: 'America/Mexico_City',
  console: {
    enabled: true,
    colors: true
  },
  file: {
    enabled: true,
    path: './logs',
    splitByLevel: true,
    writeAll: true
  }
});
```

Aunque **`console.enabled`** y **`file.enabled`** esten en **`true`**, el valor maestro **`enabled: false`** evita toda escritura.

---

## Uso con @jarvis/bootstrap

**`@jarvis/bootstrap`** normaliza la configuración del logger desde **`settings.json`**.

```ts
const loggerModule = createLoggerModule(jarvisBootstrap.logger);
```

---

## Uso con @jarvis/core

```ts
const core = await Jarvis.boot({
  app: jarvisBootstrap.app,
  server: jarvisBootstrap.server,
  runtimeModules: [
    configModule,
    loggerModule
  ]
});

await core.bootModules();

const logger = core.service<LoggerService>('logger');

logger?.info('J.A.R.V.I.S. iniciado');

await core.shutdown();
```

---

## Niveles de log

```txt
debug
info
warn
error
fatal
```

Orden de prioridad:

```txt
debug < info < warn < error < fatal
```

---

## Métodos disponibles

```ts
logger.debug('Mensaje debug');
logger.info('Mensaje info');
logger.warn('Mensaje warn');
logger.error('Mensaje error');
logger.fatal('Mensaje fatal');
```

---

## logger.child()

**`child(module)`** crea un logger asociado a un módulo específico.

```ts
const configLogger = logger.child('Config');

configLogger.info('Configuración cargada');
```

---

## Formato de consola

```txt
[INFO ] 2026-06-24 20:28:21 | [SandboxAPI] Módulo iniciado
[DEBUG] 2026-06-24 20:28:21 | [Config] Configuración cargada
[WARN ] 2026-06-24 20:28:21 | [Database] Conexión lenta detectada
[ERROR] 2026-06-24 20:28:21 | [Config] No se pudo cargar settings.json
[FATAL] 2026-06-24 20:28:21 | [Core] No se pudo iniciar la aplicación
```

---

## Metadata, objetos y arreglos

El logger puede imprimir contexto adicional como JSON legible.

```ts
logger.debug('Configuración cargada desde settings.json', {
  module: 'Config',
  data: config.all()
});
```

Salida:

```txt
[DEBUG] 2026-06-24 20:28:21 | [Config] Configuración cargada desde settings.json
{
  "data": {
    "app": {
      "name": "Sandbox-API"
    }
  }
}
```

---

## Errores

Los errores se normalizan para que no se impriman como objetos vacíos.

```ts
logger.error('No se pudo cargar settings.json', {
  module: 'Config',
  error
});
```

Salida:

```json
{
  "error": {
    "name": "Error",
    "message": "Archivo no encontrado",
    "stack": "..."
  }
}
```

---

## Archivos generados

Cuando la salida a archivo está habilitada, se usa la estructura:

```txt
logs/YYYY/MM/DD/
```

Los nombres de archivo siguen este formato:

```txt
YYYY_MM_DD_APP_LEVEL.log
```

Ejemplos:

```txt
2026_06_24_JARVIS_SANDBOXAPI_ALL.log
2026_06_24_JARVIS_SANDBOXAPI_DEBUG.log
2026_06_24_JARVIS_SANDBOXAPI_INFO.log
2026_06_24_JARVIS_SANDBOXAPI_WARN.log
2026_06_24_JARVIS_SANDBOXAPI_ERROR.log
2026_06_24_JARVIS_SANDBOXAPI_FATAL.log
```

---

## Archivo ALL

Cuando **`writeAll`** está activo, todos los logs también se escriben en un archivo concentrado:

```txt
YYYY_MM_DD_APP_ALL.log
```

Este archivo permite revisar el flujo completo de la aplicación.

---

## Zona horaria

El logger usa **`timeZone`** para formatear fechas y construir rutas de logs.

```ts
timeZone: 'America/Mexico_City'
```

---

## Escritura ordenada

**`LoggerService`** mantiene una cola interna de escritura para evitar que los logs se mezclen fuera de orden en archivos como **`ALL.log`**.

---

## Scripts disponibles

### Build

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/logger build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/logger typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/logger run clean
```

---

## Validacion recomendada

### Logger apagado

```json
{
  "modules": {
    "logger": {
      "enabled": false,
      "console": {
        "enabled": true
      },
      "file": {
        "enabled": true
      }
    }
  }
}
```

Comando:

```bash
docker compose exec jarvis-node rm -rf apps/sandbox-api/logs
docker compose exec jarvis-node pnpm verify
```

Resultado esperado:

```txt
No hay salida de logger en consola.
No se crea apps/sandbox-api/logs.
LoggerService sigue disponible.
```

---

## Estado actual

Actualmente **`@jarvis/logger`** ya puede:

- Crear un módulo vivo compatible con **`@jarvis/core`**.
- Exponer **`LoggerService`** como servicio.
- Escribir logs en consola.
- Escribir logs en archivos.
- Usar archivo **`ALL.log`**.
- Usar archivos separados por nivel.
- Crear rutas por año, mes y día.
- Usar zona horaria configurable.
- Escribir metadata como JSON legible.
- Normalizar errores.
- Mantener orden de escritura.
- Integrarse con **`@jarvis/bootstrap`**.
- Respetar **`enabled: false`** como switch maestro.

---

## Notas para desarrollo

- No usar **`console.log()`** directamente en packages cuando **`LoggerService`** esté disponible.
- No imprimir secretos reales en logs.
- No subir **`logs/`** ni **`*.log`** a Git.
- Mantener documentación en español.
- Mantener comentarios útiles en español.
- Mantener commits en español.
