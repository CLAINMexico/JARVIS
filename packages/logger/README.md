## Introducción

**`@jarvis/logger`** es el paquete oficial de logging del ecosistema **`J.A.R.V.I.S.`**.

Este paquete permite registrar eventos del sistema en consola y archivos usando niveles, paquete origen, aplicación, contexto adicional, zona horaria y una estructura de logs ordenada por fecha.

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
- Usar un formato homologado para consola y archivos.
- Identificar el paquete origen mediante **`package`**.
- Identificar la aplicación mediante **`appName`**.
- Agregar **`statusCode`** opcional para eventos HTTP.
- Crear un archivo concentrado **`all.log`**.
- Crear archivos separados por nivel.
- Usar zona horaria configurable.
- Mantener el orden de escritura mediante una cola interna.
- Formatear contexto adicional como JSON legible.
- Evitar duplicar metadata ya impresa en la línea principal.
- Normalizar errores para imprimirlos correctamente.
- Controlar si los errores se imprimen con stack trace mediante **`error.verbose`**.
- Permitir loggers hijos mediante **`child(module)`**.
- Permitir loggers asociados a paquetes mediante **`package(packageName)`**.
- Respetar **`enabled: false`** como switch maestro del módulo.

---

## Funcionamiento

**`@jarvis/logger`** se integra al runtime mediante la función **`createLoggerModule()`**, la cual crea un módulo compatible con **`@jarvis/core`**.

Este módulo expone una instancia de **`LoggerService`** como servicio del runtime:

```ts
const logger = core.service<LoggerService>('logger');
```

### Formato homologado

El formato oficial de salida es:

```txt
[YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] | [STATUSCODE] - MESSAGE
```

Ejemplo con **`statusCode`**:

```txt
[2026-07-04 14:10:24] [INFO] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [200] - Respuesta exitosa generada por @jarvis/http.
```

Ejemplo sin **`statusCode`**:

```txt
[2026-07-04 14:10:18] [INFO] [Sandbox-API] [J.A.R.V.I.S. | Sandbox-API] - Servidor HTTPS: https://localhost:3000
```

El bloque **`statusCode`** es opcional porque no todos los logs pertenecen a operaciones HTTP.

### Campos principales

Cada evento normalizado puede incluir:

```txt
timestamp
level
package
appName
module
event
statusCode
message
context
```

Uso visual:

```txt
timestamp  -> [2026-07-04 14:10:24]
level      -> [INFO]
package    -> [@jarvis/http]
appName    -> [J.A.R.V.I.S. | Sandbox-API]
statusCode -> | [200]
message    -> Respuesta exitosa generada por @jarvis/http.
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

Salida visual:

```txt
[DEBUG]
[INFO]
[WARN]
[ERROR]
[FATAL]
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

| logger.enabled | console.enabled | file.enabled | consola | archivos | servicio |
|:--------------:|:---------------:|:------------:|:-------:|:--------:|:--------:|
| true           | true            | true         | sí      | sí       | sí       |
| true           | false           | true         | no      | sí       | sí       |
| true           | true            | false        | sí      | no       | sí       |
| true           | false           | false        | no      | no       | sí       |
| false          | true            | true         | no      | no       | sí       |
| false          | false           | false        | no      | no       | sí       |

### Loggers hijos

**`child(module)`** crea un logger asociado a un módulo específico:

```ts
const configLogger = logger.child('Config');

configLogger.info('Configuración cargada');
```

### Loggers por paquete

**`package(packageName)`** crea un logger asociado a un paquete específico:

```ts
const httpLogger = logger.package('@jarvis/http');

httpLogger.info('Respuesta exitosa generada por @jarvis/http.', {
  statusCode: 200,
  route: '/http/success',
  method: 'GET'
});
```

Salida esperada:

```txt
[2026-07-04 14:10:24] [INFO] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [200] - Respuesta exitosa generada por @jarvis/http.
{
  "route": "/http/success",
  "method": "GET"
}
```

### Contexto adicional

El logger puede imprimir contexto adicional como JSON legible:

```ts
logger.debug('Configuración cargada desde settings.json.', {
  package: '@jarvis/config',
  event: 'config.loaded',
  data: config.all()
});
```

Salida esperada:

```txt
[2026-07-04 14:10:18] [DEBUG] [@jarvis/config] [J.A.R.V.I.S. | Sandbox-API] - Configuración cargada desde settings.json.
{
  "data": {
    "app": {
      "name": "Sandbox-API"
    }
  }
}
```

Los campos usados por la línea principal no se duplican dentro del contexto.

No se imprimen como metadata adicional:

```txt
package
module
event
statusCode
```

Esto evita salidas repetidas y mantiene los logs limpios.

### Errores

Los errores se normalizan para evitar que se impriman como objetos vacíos:

```ts
logger.error('No se pudo cargar settings.json.', {
  package: '@jarvis/config',
  event: 'config.load.failed',
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

Cuando la salida a archivo está habilitada, se usa la estructura estándar:

```txt
logs/YYYY/MM/DD/
```

Los nombres de archivo son simples y no son configurables:

```txt
all.log
debug.log
info.log
warn.log
error.log
fatal.log
```

Ejemplo:

```txt
logs/
  2026/
    07/
      04/
        all.log
        debug.log
        info.log
        warn.log
        error.log
        fatal.log
```

Cuando **`writeAll`** está activo, todos los logs también se escriben en:

```txt
all.log
```

Cuando **`splitByLevel`** está activo, cada log también se escribe en el archivo correspondiente a su nivel:

```txt
debug.log
info.log
warn.log
error.log
fatal.log
```

Regla interna:

```txt
La ruta organiza por fecha.
El archivo organiza por nivel.
La línea del log contiene el contexto.
```

### Zona horaria

El logger usa **`timeZone`** para formatear fechas y construir rutas de logs:

```ts
timeZone: 'America/Mexico_City'
```

### Escritura ordenada

**`LoggerService`** mantiene una cola interna de escritura para evitar que los logs se mezclen fuera de orden en archivos como **`all.log`**.

---

## Configuración de transports

**`@jarvis/logger`** organiza sus salidas mediante la propiedad **`transports`**.

Cada transport representa un destino donde el logger puede escribir eventos.

Configuración recomendada:

```json
{
  "packages": {
    "logger": {
      "enabled": true,
      "level": "debug",
      "error": {
        "verbose": false
      },
      "transports": {
        "console": {
          "enabled": true,
          "colors": true
        },
        "file": {
          "enabled": true,
          "path": "./logs",
          "splitByLevel": true,
          "writeAll": true
        }
      }
    }
  }
}
```

La ruta oficial queda organizada así:

```txt
packages.logger.transports.console
packages.logger.transports.file
```

---

### Transport console

El transport **`console`** controla la salida de logs en consola.

```json
{
  "console": {
    "enabled": true,
    "colors": true
  }
}
```

Opciones:

```txt
enabled = habilita o deshabilita la escritura en consola
colors  = habilita o deshabilita colores ANSI en consola
```

Cuando **`console.enabled`** es **`false`**, el logger deja de imprimir eventos en consola.

Cuando **`console.colors`** es **`false`**, la salida en consola se mantiene activa, pero sin colores.

---

### Transport file

El transport **`file`** controla la escritura de logs en archivos.

```json
{
  "file": {
    "enabled": true,
    "path": "./logs",
    "splitByLevel": true,
    "writeAll": true
  }
}
```

Opciones:

```txt
enabled      = habilita o deshabilita la escritura en archivos
path         = ruta base donde se crearán los archivos de log
splitByLevel = habilita archivos separados por nivel
writeAll     = escribe todos los eventos también en all.log
```

Cuando **`file.enabled`** es **`false`**, no se generan archivos de log.

La estructura interna de archivos se conserva homologada:

```txt
logs/YYYY/MM/DD/all.log
logs/YYYY/MM/DD/debug.log
logs/YYYY/MM/DD/info.log
logs/YYYY/MM/DD/warn.log
logs/YYYY/MM/DD/error.log
logs/YYYY/MM/DD/fatal.log
```

---

### Switch maestro del logger

La propiedad **`enabled`** sigue funcionando como switch maestro.

Cuando **`packages.logger.enabled`** es **`false`**:

```txt
- El servicio logger sigue existiendo.
- No se escribe en consola.
- No se escriben archivos.
- No se imprimen mensajes internos de boot/shutdown.
```

---

### Preparación para nuevos transports

La propiedad **`transports`** permite agregar nuevas salidas sin crecer propiedades directas dentro de la raíz de configuración del logger.

Ejemplos futuros:

```txt
packages.logger.transports.database
packages.logger.transports.http
packages.logger.transports.cloud
packages.logger.transports.otel
```

---

## Configuración de errores

**`@jarvis/logger`** permite controlar cómo se imprimen los errores dentro del contexto de un log.

La configuración se declara dentro de las opciones del logger:

```ts
createLoggerModule({
  error: {
    verbose: false
  }
});
```

Cuando se usa desde una aplicación con **`settings.json`**, la ruta recomendada es:

```txt
packages.logger.error.verbose
```

Ejemplo:

```json
{
  "packages": {
    "logger": {
      "enabled": true,
      "level": "debug",
      "error": {
        "verbose": false
      },
      "transports": {
        "console": {
          "enabled": true,
          "colors": true
        },
        "file": {
          "enabled": true,
          "path": "./logs",
          "splitByLevel": true,
          "writeAll": true
        }
      }
    }
  }
}
```

### error.verbose en false

Cuando **`verbose`** está en **`false`**, los errores se imprimen de forma segura y resumida.

Ejemplo:

```json
{
  "error": {
    "name": "JarvisHttpError",
    "message": "Token JWT inválido o expirado.",
    "code": "UNAUTHORIZED"
  }
}
```

Este modo evita imprimir stack traces completos en logs donde no sean necesarios.

### error.verbose en true

Cuando **`verbose`** está en **`true`**, los errores se imprimen con información completa, incluyendo **`stack`** cuando exista.

Ejemplo:

```json
{
  "error": {
    "name": "JarvisHttpError",
    "message": "Token JWT inválido o expirado.",
    "code": "UNAUTHORIZED",
    "stack": "JarvisHttpError: Token JWT inválido o expirado..."
  }
}
```

Este modo es útil para depuración local.

### Uso desde otros paquetes

Los paquetes pueden enviar el error completo en el contexto:

```ts
logger.warn('No se pudo verificar el token JWT.', {
  package: '@jarvis/security',
  event: 'security.jwt.verify.failed',
  statusCode: 401,
  route: '/security/jwt/verify',
  method: 'POST',
  error
});
```

**`@jarvis/logger`** decide cómo serializar la propiedad **`error`** según la configuración activa.

Esta regla aplica para consola y archivos.

---

## Uso

Ejemplo básico:

```ts
import {
  createLoggerModule
} from '@jarvis/logger';

const loggerModule = createLoggerModule({
  enabled: true,
  appName: 'J.A.R.V.I.S. | Sandbox-API',
  level: 'debug',
  defaultPackage: 'Sandbox-API',
  defaultModule: 'Sandbox-API',
  timeZone: 'America/Mexico_City',
  transports: {
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
  }
});

loggerModule.service.info('Logger inicializado.');
```

Ejemplo con **`package`** y **`statusCode`**:

```ts
loggerModule.service.info('Respuesta exitosa generada por @jarvis/http.', {
  package: '@jarvis/http',
  event: 'http.response.success',
  statusCode: 200,
  route: '/http/success',
  method: 'GET'
});
```

Salida esperada:

```txt
[2026-07-04 14:10:24] [INFO] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [200] - Respuesta exitosa generada por @jarvis/http.
{
  "route": "/http/success",
  "method": "GET"
}
```

Ejemplo con error HTTP controlado:

```ts
loggerModule.service.warn('Token inválido o ausente.', {
  package: '@jarvis/http',
  event: 'http.response.error',
  statusCode: 401,
  route: '/http/error',
  method: 'GET',
  code: 'UNAUTHORIZED'
});
```

Salida esperada:

```txt
[2026-07-04 14:10:29] [WARN] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [401] - Token inválido o ausente.
{
  "route": "/http/error",
  "method": "GET",
  "code": "UNAUTHORIZED"
}
```

Ejemplo con logger apagado:

```ts
const loggerModule = createLoggerModule({
  enabled: false,
  appName: 'J.A.R.V.I.S. | Sandbox-API',
  level: 'debug',
  defaultPackage: 'Sandbox-API',
  defaultModule: 'Sandbox-API',
  timeZone: 'America/Mexico_City',
  transports: {
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

logger.info('J.A.R.V.I.S. iniciado.');

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
- Mantener la estructura interna de logs como estándar del paquete.
- Mantener documentación en español.
- Mantener comentarios útiles en español.
- Mantener commits en español.
