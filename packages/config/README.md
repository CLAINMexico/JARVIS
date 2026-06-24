## @jarvis/config

**`@jarvis/config`** es el package de configuración del ecosistema **`J.A.R.V.I.S.`**

Este package permite cargar, almacenar y consultar configuración para aplicaciones construidas sobre el runtime de **`J.A.R.V.I.S.`**

---

## Objetivo

El objetivo de **`@jarvis/config`** es centralizar la configuración de una aplicación y exponerla mediante un servicio reutilizable.

Este package está pensado para separar claramente:

```
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
```

En palabras simples:

```
@jarvis/config lee la configuración de la app.
ConfigService permite consultarla.
@jarvis/core monta el módulo durante el arranque.
```

---

## Responsabilidades principales

**`@jarvis/config`** se encarga de:

- Crear un módulo compatible con **`JarvisRuntimeModule`**.
- Cargar configuración desde un objeto directo.
- Cargar configuración desde un archivo **`settings.json`**.
- Guardar la configuración dentro de **`ConfigService`**.
- Consultar valores mediante paths separados por punto.
- Exponer la configuración completa cuando sea necesario.
- Participar en el ciclo de vida del runtime mediante **`boot()`** y **`shutdown()`**.

---

## Lo que NO debe hacer

**`@jarvis/config`** no debe encargarse directamente de:

- Conectarse a bases de datos.
- Validar licencias.
- Firmar o validar JWT.
- Enviar correos o notificaciones.
- Crear servidores HTTP.
- Implementar lógica de negocio.
- Guardar secretos reales dentro de **`settings.json`**.

Esas responsabilidades corresponden a otros packages como:

- **`@jarvis/database`**
- **`@jarvis/license`**
- **`@jarvis/security`**
- **`@jarvis/notify`**
- **`@jarvis/storage`**

---

## Ubicación dentro del monorepo

```
packages/config
```

---

## Estructura actual

```
packages/config/
  src/
    contracts/
      config-options.ts
      config-value.ts
    runtime/
      config-file-loader.ts
      config-module.ts
      config-service.ts
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

- **`ConfigService`**
- **`createConfigModule`**
- **`ConfigModule`**
- **`ConfigModuleOptions`**
- **`ConfigObject`**
- **`ConfigValue`**
- **`ConfigPrimitiveValue`**
- **`JarvisConfigPackage`**

### src/contracts/config-value.ts

Define los tipos base de valores permitidos dentro de la configuración.

Incluye:

- **`ConfigPrimitiveValue`**
- **`ConfigValue`**
- **`ConfigObject`**

Estos tipos permiten representar estructuras anidadas como un **`settings.json`**.

### src/contracts/config-options.ts

Define las opciones aceptadas por **`createConfigModule()`**.

Actualmente soporta:

```ts
values?: ConfigObject;
file?: string;
```

### src/runtime/config-service.ts

Contiene la clase **`ConfigService`**.

Este servicio se encarga de:

- Guardar valores de configuración.
- Cargar nuevos valores mediante **`load()`**.
- Consultar valores mediante **`get(path)`**.
- Devolver todos los valores mediante **`all()`**.

### src/runtime/config-file-loader.ts

Contiene la función **`loadConfigFile()`**.

Esta función:

- Recibe una ruta de archivo.
- Lee el archivo desde disco.
- Parsea el contenido como JSON.
- Devuelve el resultado como **`ConfigObject`**.

### src/runtime/config-module.ts

Contiene:

- La interfaz **`ConfigModule`**.
- La función **`createConfigModule()`**.

Este archivo conecta **`@jarvis/config`** con **`@jarvis/core`**, ya que crea un módulo compatible con **`JarvisRuntimeModule`**.

---

## Uso básico con valores directos

```ts
import { createConfigModule } from '@jarvis/config';

const configModule = createConfigModule({
  values: {
    app: {
      name: 'MyApp',
      version: '1.0.0',
      environment: 'local'
    },
    server: {
      host: '0.0.0.0',
      port: 3000
    }
  }
});

await configModule.boot?.();

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await configModule.shutdown?.();
```

---

## Uso con settings.json

```ts
import { createConfigModule } from '@jarvis/config';

const configModule = createConfigModule({
  file: './settings.json'
});

await configModule.boot?.();

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await configModule.shutdown?.();
```

---

## Uso integrado con @jarvis/core

```ts
import { Jarvis } from '@jarvis/core';
import { createConfigModule } from '@jarvis/config';

const configModule = createConfigModule({
  file: './settings.json'
});

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
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

await core.bootModules();

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await core.shutdown();
```

---

## ConfigService

**`ConfigService`** es el servicio principal de configuración.

Ejemplo:

```ts
import { ConfigService } from '@jarvis/config';

const config = new ConfigService({
  app: {
    name: 'MyApp'
  },
  server: {
    port: 3000
  }
});

console.log(config.get('app.name'));
console.log(config.get('server.port'));
console.log(config.all());
```

---

## Lectura por path

**`ConfigService.get()`** permite leer valores usando paths separados por punto.

Ejemplo:

```ts
config.get('app.name');
config.get('server.port');
config.get('database.connections.main.driver');
config.get('modules.logger.enabled');
```

Si el path no existe, devuelve:

```
undefined
```

---

## settings.json

**`settings.json`** representa la configuración local/real de una app.

Ejemplo:

```json
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
    "environment": "local"
  },
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "basePath": "/api"
  },
  "logger": {
    "level": "debug",
    "pretty": true
  }
}
```

Este archivo no debe subirse a Git si contiene configuración local real.

La plantilla segura debe ser:

```
settings.example.json
```

---

## settings.example.json

**`settings.example.json`** sirve como referencia versionable de configuración.

Este archivo sí puede subirse a Git porque no debe contener secretos reales.

Debe incluir:

- Estructura base de configuración.
- Valores genéricos.
- Referencias a variables de entorno.
- Configuración no sensible.

---

## Referencias a secretos

**`settings.json`** no debe guardar secretos reales.

En vez de esto:

```json
{
  "database": {
    "password": "PasswordReal"
  }
}
```

se debe usar una referencia:

```json
{
  "database": {
    "passwordRef": "SETTINGS_DATABASE_PASSWORD"
  }
}
```

Y el valor real debe vivir en `.env`:

```env
SETTINGS_DATABASE_PASSWORD=
```

Regla principal:

```
settings.json = configuración y referencias
.env = secretos reales
```

---

## Ciclo de vida

**`@jarvis/config`** participa en el ciclo de vida de **`J.A.R.V.I.S.`** mediante **`JarvisRuntimeModule`**.

### boot()

Durante **`boot()`**, el módulo:

- Lee **`settings.json`** si se definió **`file`**.
- Parsea el archivo.
- Carga los valores dentro de **`ConfigService`**.
- Deja la configuración lista para consulta.

### shutdown()

Durante **`shutdown()`**, el módulo ejecuta su apagado.

Actualmente no libera recursos críticos, pero el método existe para mantener compatibilidad con el ciclo de vida del core.

---

## Comportamiento actual

Actualmente, **`@jarvis/config`** lee el archivo de configuración una sola vez durante **`boot()`**.

Eso significa:

```
Si settings.json cambia mientras la app está corriendo,
los cambios no se aplican automáticamente.
```

Para aplicar cambios:

```
Reiniciar la aplicación.
```

Esto es intencional para mantener una configuración estable durante la ejecución.

---

## Comportamiento futuro

Más adelante se puede agregar:

- **`reload()`** manual.
- Validación de estructura.
- Lectura de **`.env`**.
- Resolución de **`secretRef`**, **`passwordRef`**, **`keyRef`**, etc.
- Soporte opcional para **`watch`**.
- Helpers tipados como **`getString()`**, **`getNumber()`** y **`getBoolean()`**.

---

## Relación con @jarvis/core

**`@jarvis/config`** depende de **`@jarvis/core`** para implementar **`JarvisRuntimeModule`**.

Relación correcta:

```
@jarvis/core
= define contratos base

@jarvis/config
= implementa un módulo compatible con el core
```

Correcto:

```
@jarvis/config → @jarvis/core
```

Incorrecto:

```
@jarvis/core → @jarvis/config
```

Esto evita dependencias circulares y mantiene el core limpio.

---

## Scripts disponibles

### Build

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/config build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/config typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/config clean
```

---

## Archivos generados

Este package puede generar:

```
dist/
node_modules/
```

Estos archivos no deben subirse a Git.

**`dist/`** se genera con build.

**`node_modules/`** se genera con pnpm.

---

## Convenciones

### Nombres de archivos

Dentro de **`@jarvis/config`** se usa prefijo **`config-*`** porque este package define conceptos propios del módulo de configuración.

Ejemplos:

```
config-options.ts
config-value.ts
config-service.ts
config-module.ts
config-file-loader.ts
```

### Nombres en código

```
camelCase     → variables, funciones y métodos
PascalCase    → clases, interfaces y types
kebab-case    → nombres de archivos
UPPER_CASE    → constantes globales fijas
```

### Imports ESM

Este proyecto usa TypeScript con ESM.

Por eso los imports relativos deben usar extensión **`.js`**, aunque los archivos fuente sean **`.ts`**.

Ejemplo:

```ts
import type { ConfigObject } from './contracts/config-value.js';
```

---

## Estado actual

Actualmente **`@jarvis/config`** ya puede:

- Crear un módulo vivo compatible con **`@jarvis/core`**.
- Cargar configuración desde **`values`**.
- Cargar configuración desde **`settings.json`**.
- Guardar valores en **`ConfigService`**.
- Consultar valores con **`get(path)`**.
- Devolver toda la configuración con **`all()`**.
- Arrancar mediante **`bootModules()`** desde **`@jarvis/core`**.
- Apagarse mediante **`shutdown()`** desde **`@jarvis/core`**.

---

## Notas para desarrollo

- No guardar secretos reales dentro de `settings.json`.
- No subir `settings.json` real a Git.
- Mantener `settings.example.json` como referencia segura.
- Mantener `.env` fuera de Git.
- Mantener `.env.example` como plantilla segura.
- No acoplar **`@jarvis/core`** a **`@jarvis/config`**.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
