## Introducción

**`@jarvis/logger`** es el paquete oficial de logging del ecosistema **`J.A.R.V.I.S.`**.

Este paquete permite registrar eventos del sistema en consola y archivos, usando niveles, módulos, contexto adicional, zona horaria y una estructura de logs ordenada por fecha.

---

## Objetivo

El objetivo de **`@jarvis/logger`** es centralizar la forma en que **`J.A.R.V.I.S.`** registra información técnica, eventos de arranque, advertencias, errores y datos útiles para diagnóstico.

En palabras simples:

```txt
@jarvis/logger es la bitácora oficial de J.A.R.V.I.S.
```

Actualmente, este paquete permite:

- Crear un módulo compatible con **`JarvisRuntimeModule`**.
- Exponer **`LoggerService`** como servicio del runtime.
- Registrar mensajes por nivel.
- Escribir logs en consola.
- Escribir logs en archivos.
- Crear un archivo concentrado **`ALL.log`**.
- Crear archivos separados por nivel.
- Usar zona horaria configurable.
- Mantener el orden de escritura mediante una cola interna.
- Formatear contexto adicional como JSON legible.
- Normalizar errores para imprimirlos correctamente.
- Permitir loggers hijos mediante **`child(module)`**.
- Respetar **`enabled: false`** como switch maestro del módulo.

---

## Funcionamiento

**`@jarvis/logger`** se integra al runtime mediante la función **`createLoggerModule()`**, la cual crea un módulo compatible con **`@jarvis/core`**.

Este módulo expone una instancia de **`LoggerService`** como servicio del runtime:

```ts
const logger = core.service<LoggerService>('logger');
```

### Niveles de log

Los niveles disponibles son:

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

### Métodos disponibles

```ts
logger.debug('Mensaje debug');
logger.info('Mensaje info');
logger.warn('Mensaje warn');
logger.error('Mensaje error');
logger.fatal('Mensaje fatal');
```

### Switch maestro

El valor **`enabled`** controla el estado general del módulo logger.

Cuando está en **`true`**, el logger puede escribir en los transports habilitados.

Cuando está en **`false`**, el servicio logger sigue disponible, pero no escribe en consola ni en archivos.

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

### Transports

El logger puede escribir en diferentes salidas.

Actualmente soporta:

```txt
console
file
```

El valor **`console.enabled`** controla únicamente la salida a consola.

El valor **`file.enabled`** controla únicamente la salida a archivos.

Tabla de comportamiento:

```txt
logger.enabled | console.enabled | file.enabled | consola | archivos | servicio
true           | true            | true         | sí      | sí       | sí
true           | false           | true         | no      | sí       | sí
true           | true            | false        | sí      | no       | sí
true           | false           | false        | no      | no       | sí
false          | true            | true         | no      | no       | sí
false          | false           | false        | no      | no       | sí
```

### Loggers hijos

**`child(module)`** crea un logger asociado a un módulo específico:

```ts
const configLogger = logger.child('Config');

configLogger.info('Configuración cargada');
```

### Contexto adicional

El logger puede imprimir contexto adicional como JSON legible:

```ts
logger.debug('Configuración cargada desde settings.json', {
  module: 'Config',
  data: config.all()
});
```

Salida esperada:

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

### Errores

Los errores se normalizan para evitar que se impriman como objetos vacíos:

```ts
logger.error('No se pudo cargar settings.json', {
  module: 'Config',
  error
});
```

Salida esperada:

```json
{
  "error": {
    "name": "Error",
    "message": "Archivo no encontrado",
    "stack": "..."
  }
}
```

### Archivos generados

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

Cuando **`writeAll`** está activo, todos los logs también se escriben en un archivo concentrado:

```txt
YYYY_MM_DD_APP_ALL.log
```

Este archivo permite revisar el flujo completo de la aplicación.

### Zona horaria

El logger usa **`timeZone`** para formatear fechas y construir rutas de logs:

```ts
timeZone: 'America/Mexico_City'
```

### Escritura ordenada

**`LoggerService`** mantiene una cola interna de escritura para evitar que los logs se mezclen fuera de orden en archivos como **`ALL.log`**.

---

## Uso

Ejemplo básico:

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

Ejemplo con logger apagado:

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

Aunque **`console.enabled`** y **`file.enabled`** estén en **`true`**, el valor maestro **`enabled: false`** evita toda escritura.

Ejemplo con **`@jarvis/bootstrap`**:

```ts
const loggerModule = createLoggerModule(jarvisBootstrap.logger);
```

Ejemplo con **`@jarvis/core`**:

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

## Notas

**`@jarvis/logger`** no debe reemplazar responsabilidades de otros paquetes. Su función es registrar eventos, errores y datos útiles para diagnóstico.

Este paquete no debe encargarse directamente de:

- Guardar auditoría de negocio.
- Enviar notificaciones.
- Subir archivos a almacenamiento externo.
- Persistir logs en base de datos.
- Resolver reglas de monitoreo avanzadas.
- Implementar lógica específica de negocio.

Esas capacidades pueden agregarse más adelante mediante paquetes o transports especializados.

También es importante considerar:

- No usar **`console.log()`** directamente en paquetes cuando **`LoggerService`** esté disponible.
- No imprimir secretos reales en logs.
- No subir **`logs/`** ni **`*.log`** a Git.
- Mantener documentación en español.
- Mantener comentarios útiles en español.
- Mantener commits en español.
