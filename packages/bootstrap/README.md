## @jarvis/bootstrap

**`@jarvis/bootstrap`** es el package encargado de preparar la configuración inicial de una aplicación **`J.A.R.V.I.S.`** antes de arrancar el runtime.

Este package permite cargar **`settings.json`**, crear un servicio de configuración y normalizar valores principales para que una app pueda construir sus módulos y arrancar **`@jarvis/core`** de forma ordenada.

---

## Objetivo

El objetivo de **`@jarvis/bootstrap`** es preparar la app antes de prender el runtime.

En palabras simples:

```txt
@jarvis/bootstrap prepara la mesa antes de prender J.A.R.V.I.S.
```

Este package existe para evitar que **`@jarvis/core`** tenga que leer archivos o depender directamente de packages concretos como **`@jarvis/config`**.

---

## Responsabilidades principales

**`@jarvis/bootstrap`** se encarga de:

- Leer **`settings.json`** usando **`@jarvis/config`**.
- Crear una instancia de **`ConfigService`**.
- Normalizar datos de la aplicación.
- Normalizar datos del servidor.
- Normalizar configuración inicial del logger.
- Entregar un resultado listo para construir módulos y arrancar **`@jarvis/core`**.
- Mantener fuera del core la responsabilidad de leer configuración desde archivos.

---

## Lo que NO debe hacer

**`@jarvis/bootstrap`** no debe encargarse directamente de:

- Arrancar **`@jarvis/core`**.
- Ejecutar **`boot()`** de módulos vivos.
- Ejecutar **`shutdown()`**.
- Escribir logs.
- Conectarse a bases de datos.
- Resolver reglas de negocio.
- Validar licencias.
- Servir rutas HTTP.
- Leer secretos reales directamente desde `.env`.

Este package solo prepara valores iniciales.

---

## Ubicación dentro del monorepo

```txt
packages/bootstrap
```

---

## Estructura actual

```txt
packages/bootstrap/
  src/
    contracts/
      bootstrap-app.ts
      bootstrap-logger.ts
      bootstrap-options.ts
      bootstrap-result.ts
      bootstrap-server.ts
    runtime/
      jarvis-bootstrap.ts
    utils/
      bootstrap-logger-utils.ts
      bootstrap-value-utils.ts
    index.ts
  package.json
  tsconfig.json
  README.md
```

---

## Archivos principales

### src/index.ts

Entrada pública del package.

Desde aquí se exportan:

- **`BootstrapOptions`**
- **`BootstrapApp`**
- **`BootstrapServer`**
- **`BootstrapLogger`**
- **`BootstrapResult`**
- **`createJarvisBootstrap`**
- Utilidades de normalización.
- **`JarvisBootstrapPackage`**

### src/contracts/bootstrap-options.ts

Define las opciones necesarias para crear el bootstrap inicial.

Actualmente recibe:

```ts
settingsFile: string;
```

### src/contracts/bootstrap-result.ts

Define la estructura final devuelta por **`createJarvisBootstrap()`**.

Incluye:

- **`settings`**
- **`config`**
- **`app`**
- **`server`**
- **`logger`**

### src/runtime/jarvis-bootstrap.ts

Contiene la función principal **`createJarvisBootstrap()`**.

Esta función:

- Lee **`settings.json`**.
- Crea **`ConfigService`**.
- Normaliza app.
- Normaliza server.
- Normaliza logger.
- Devuelve un objeto **`BootstrapResult`**.

### src/utils/bootstrap-value-utils.ts

Contiene helpers para convertir valores desconocidos de configuración en tipos seguros.

Incluye:

- **`getBootstrapString()`**
- **`getBootstrapNumber()`**
- **`getBootstrapBoolean()`**
- **`getBootstrapEnvironment()`**
- **`getBootstrapLoggerLevel()`**

### src/utils/bootstrap-logger-utils.ts

Contiene helpers para construir valores normalizados relacionados con logger.

Incluye:

- **`buildBootstrapLoggerAppName()`**
- **`buildBootstrapLoggerDefaultModule()`**

---

## Uso básico

Ejemplo conceptual:

```ts
import {
  createJarvisBootstrap
} from '@jarvis/bootstrap';

const bootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

console.log(bootstrap.app);
console.log(bootstrap.server);
console.log(bootstrap.logger);
```

---

## Uso con @jarvis/core

Ejemplo conceptual:

```ts
import {
  Jarvis
} from '@jarvis/core';

import {
  createConfigModule
} from '@jarvis/config';

import {
  createJarvisBootstrap
} from '@jarvis/bootstrap';

const bootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

const configModule = createConfigModule({
  values: bootstrap.settings
});

const core = await Jarvis.boot({
  app: bootstrap.app,
  server: bootstrap.server,
  runtimeModules: [
    configModule
  ]
});

await core.bootModules();

console.log(core.info());

await core.shutdown();
```

---

## Resultado del bootstrap

**`createJarvisBootstrap()`** devuelve una estructura como esta:

```ts
{
  settings,
  config,
  app,
  server,
  logger
}
```

### settings

Contiene la configuración completa cargada desde **`settings.json`**.

### config

Contiene una instancia de **`ConfigService`** lista para consultar valores mediante paths.

Ejemplo:

```ts
bootstrap.config.get('app.name');
bootstrap.config.get('modules.logger.enabled');
```

### app

Contiene la configuración normalizada de la app.

Ejemplo:

```ts
{
  name: 'Sandbox-API',
  description: 'Ambiente de pruebas para aplicaciones de tipo API',
  version: '1.0.0',
  environment: 'local',
  license: 'SETTINGS_LICENSE_KEY',
  timeZone: 'America/Mexico_City'
}
```

### server

Contiene la configuración normalizada del servidor.

Ejemplo:

```ts
{
  host: 'localhost',
  port: 3000
}
```

### logger

Contiene la configuración normalizada para crear **`@jarvis/logger`**.

Ejemplo:

```ts
{
  enabled: true,
  appName: 'JARVIS_SANDBOXAPI',
  level: 'debug',
  defaultModule: 'J.A.R.V.I.S. | Sandbox-API',
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
}
```

---

## settings.json esperado

**`@jarvis/bootstrap`** espera una estructura compatible con:

```json
{
  "app": {
    "name": "MyApp",
    "description": "Descripción de la aplicación",
    "version": "0.0.0",
    "environment": "local",
    "license": "SETTINGS_LICENSE_KEY",
    "timeZone": "America/Mexico_City"
  },
  "server": {
    "host": "localhost",
    "port": 3000
  },
  "modules": {
    "logger": {
      "enabled": true,
      "level": "debug",
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
```

---

## Relación con otros packages

Relación correcta:

```txt
@jarvis/bootstrap → @jarvis/config
@jarvis/bootstrap → @jarvis/core
@jarvis/bootstrap → @jarvis/logger
```

Relación incorrecta:

```txt
@jarvis/core → @jarvis/bootstrap
@jarvis/core → @jarvis/config
@jarvis/core → @jarvis/logger
```

Esto permite que **`@jarvis/core`** siga limpio y sin conocimiento de archivos, settings o packages concretos.

---

## Decisión arquitectónica importante

**`@jarvis/bootstrap`** es una capa superior de armado.

Eso significa que puede conocer packages concretos para preparar una app, pero no debe contaminar el core.

Regla:

```txt
Core define reglas.
Config lee configuración.
Bootstrap prepara la app.
Apps arrancan el runtime.
```

---

## Scripts disponibles

### Build

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap clean
```

---

## Archivos generados

Este package puede generar:

```txt
dist/
node_modules/
```

Estos archivos no deben subirse a Git.

---

## Convenciones

### Nombres de archivos

Dentro de **`@jarvis/bootstrap`** se usa prefijo **`bootstrap-*`** para contratos y utilidades propias del bootstrap.

El runtime principal usa nombre explícito:

```txt
jarvis-bootstrap.ts
```

### Nombres en código

```txt
camelCase     → variables, funciones y métodos
PascalCase    → clases, interfaces y types
kebab-case    → nombres de archivos
UPPER_CASE    → constantes globales fijas
```

### Imports ESM

Este proyecto usa TypeScript con ESM.

Por eso los imports relativos deben usar extensión **`.js`**, aunque los archivos fuente sean **`.ts`**.

---

## Estado actual

Actualmente **`@jarvis/bootstrap`** ya puede:

- Leer **`settings.json`**.
- Crear **`ConfigService`**.
- Normalizar datos de app.
- Normalizar datos de server.
- Normalizar datos de logger.
- Devolver un **`BootstrapResult`**.
- Ser consumido desde **`apps/sandbox-api`** para validar configuración inicial.

---

## Futuro

Más adelante **`@jarvis/bootstrap`** puede crecer para:

- Normalizar configuración de database.
- Normalizar configuración de storage.
- Normalizar configuración de notifications.
- Resolver referencias hacia `.env`.
- Validar estructura completa de settings.
- Crear factories de módulos desde configuración.
- Ayudar a construir el runtime completo con menos código en `main.ts`.

---

## Notas para desarrollo

- No meter lógica de negocio en **`@jarvis/bootstrap`**.
- No arrancar **`@jarvis/core`** desde este package.
- No ejecutar ciclo de vida de módulos desde este package.
- No acoplar **`@jarvis/core`** a **`@jarvis/bootstrap`**.
- Mantener documentación en español.
- Mantener comentarios útiles en español.
- Mantener commits en español.
