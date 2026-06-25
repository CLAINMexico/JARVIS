## Sandbox API

**`Sandbox API`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este sandbox no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de **`@jarvis/core`** y de los packages que se vayan integrando al runtime.

---

## Objetivo

El objetivo de **`Sandbox API`** es validar que **`J.A.R.V.I.S.`** pueda arrancar, montar módulos reales, preparar configuración inicial y ejecutar su ciclo de vida desde el contexto de una app backend.

En palabras simples:

```txt
sandbox-api prueba cómo una API real consumiría J.A.R.V.I.S.
```

Actualmente permite validar:

- Arranque de una instancia del core mediante **`Jarvis.boot()`**.
- Recepción de configuración inicial.
- Bootstrap inicial mediante **`@jarvis/bootstrap`**.
- Registro de módulos informativos.
- Registro de módulos vivos del runtime.
- Registro de servicios internos.
- Ejecución de módulos mediante **`boot()`**.
- Apagado ordenado mediante **`shutdown()`**.
- Integración de packages reales como **`@jarvis/config`**.
- Lectura de configuración desde **`settings.json`**.
- Normalización de app, server y logger desde **`settings.json`**.

---

## Rol dentro del monorepo

Esta aplicación vive dentro de:

```txt
apps/sandbox-api
```

y forma parte del monorepo de **`J.A.R.V.I.S.`**.

Su función principal es probar cómo una API backend real consumiría los packages internos del ecosistema **`J.A.R.V.I.S.`**.

Regla importante:

```txt
Un sandbox prueba un tipo de aplicación.
No se crea un sandbox nuevo por cada package.
```

---

## Lo que NO debe hacer

**`Sandbox API`** no debe encargarse de:

- Implementar lógica real de negocio.
- Guardar secretos en archivos versionados.
- Reemplazar una app final de producción.
- Contener reglas específicas de clientes.
- Ser usado como package reutilizable.
- Acoplar directamente lógica que pertenezca a packages internos.

Este sandbox existe para probar integraciones, no para convertirse en una aplicación final.

---

## Ubicación dentro del monorepo

```txt
apps/sandbox-api
```

---

## Estructura actual

```txt
apps/sandbox-api/
  src/
    main.ts
  .env.example
  settings.example.json
  package.json
  tsconfig.json
  README.md
```

Archivos locales esperados durante desarrollo:

```txt
apps/sandbox-api/
  .env
  settings.json
```

Estos archivos locales no deben subirse a Git.

---

## Archivos principales

### src/main.ts

Archivo principal de ejecución del sandbox.

Actualmente se usa para probar:

- **`createJarvisBootstrap()`**
- **`Jarvis.boot()`**
- **`core.bootModules()`**
- **`core.info()`**
- **`core.shutdown()`**
- Registro de módulos vivos mediante **`runtimeModules`**.
- Integración de **`@jarvis/config`**.
- Lectura de **`settings.json`** mediante **`ConfigService`**.
- Normalización inicial de app, server y logger mediante **`@jarvis/bootstrap`**.

### settings.example.json

Archivo de ejemplo con la estructura base de configuración de una app que usa **`J.A.R.V.I.S.`**.

Este archivo sí debe subirse a Git porque funciona como plantilla segura.

### settings.json

Archivo local de configuración real de la app.

Este archivo no debe subirse a Git.

Debe contener configuración no sensible y referencias a secretos.

### .env.example

Plantilla de variables de entorno requeridas por la aplicación.

Este archivo sí debe subirse a Git porque no debe contener secretos reales.

### .env

Archivo local con valores reales o sensibles.

Este archivo no debe subirse a Git.

### package.json

Define el package interno **`@jarvis/sandbox-api`** y sus scripts de desarrollo.

### tsconfig.json

Configuración TypeScript específica del sandbox.

---

## Configuración

Para preparar la configuración local, copiar los archivos de ejemplo:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

Después ajustar los valores reales en:

```txt
apps/sandbox-api/settings.json
apps/sandbox-api/.env
```

---

## settings.json y .env

**`settings.json`** debe contener configuración no sensible y referencias a secretos.

Ejemplo:

```json
{
  "app": {
    "name": "Sandbox-API",
    "description": "Ambiente de pruebas para aplicaciones de tipo API",
    "version": "1.0.0",
    "environment": "local",
    "license": "SETTINGS_LICENSE_KEY",
    "timeZone": "America/Mexico_City"
  }
}
```

**`.env`** debe contener los valores reales:

```env
SETTINGS_LICENSE_KEY=
```

Regla principal:

```txt
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
```

---

## Uso actual con @jarvis/bootstrap

Actualmente **`sandbox-api`** puede ejecutar **`@jarvis/bootstrap`** para cargar y normalizar valores antes de arrancar el runtime.

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

Esto permite validar que:

- **`settings.json`** se lee correctamente.
- **`ConfigService`** queda disponible.
- **`app`** queda normalizado.
- **`server`** queda normalizado.
- **`logger`** queda normalizado.

---

## Uso actual con @jarvis/config

Actualmente **`sandbox-api`** puede montar **`@jarvis/config`** como módulo vivo del runtime.

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

## Ejecución

Desde la raíz del monorepo, ejecutar:

```bash
docker compose exec jarvis-node pnpm dev
```

Este comando ejecuta el script raíz del monorepo.

Actualmente el flujo esperado es:

```txt
Compilar packages requeridos
↓
Ejecutar sandbox-api
↓
Preparar bootstrap inicial
↓
Arrancar J.A.R.V.I.S.
↓
Bootear módulos vivos
↓
Mostrar información del runtime
↓
Apagar módulos vivos
```

---

## Scripts disponibles

### Desarrollo desde la raíz

```bash
docker compose exec jarvis-node pnpm dev
```

### Build

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api clean
```

---

## Validación de packages relacionados

### @jarvis/core

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/core build
```

### @jarvis/config

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/config typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/config build
```

### @jarvis/bootstrap

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap build
```

---

## Archivos generados

Este sandbox puede generar:

```txt
dist/
node_modules/
logs/
```

Estos archivos no deben subirse a Git.

---

## Convenciones

### Nombres de archivos

Dentro de **`sandbox-api`** se deben usar nombres claros y en **`kebab-case`** cuando aplique.

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

Actualmente **`sandbox-api`** ya puede:

- Arrancar una instancia de **`J.A.R.V.I.S.`**.
- Usar **`@jarvis/core`**.
- Usar **`@jarvis/config`**.
- Usar **`@jarvis/bootstrap`**.
- Montar módulos vivos mediante **`runtimeModules`**.
- Ejecutar **`bootModules()`**.
- Ejecutar **`shutdown()`**.
- Cargar **`settings.json`** desde **`@jarvis/config`**.
- Normalizar app, server y logger desde **`@jarvis/bootstrap`**.
- Mostrar información del runtime.

---

## Futuro

Este sandbox será usado para probar la integración progresiva de:

- **`@jarvis/logger`**
- **`@jarvis/license`**
- **`@jarvis/security`**
- **`@jarvis/database`**
- **`@jarvis/storage`**
- **`@jarvis/notify`**

Más adelante podrán existir otros sandboxes por tipo de aplicación, por ejemplo:

```txt
apps/sandbox-pwa
apps/sandbox-worker
apps/sandbox-cli
```

---

## Notas para desarrollo

- Este sandbox no debe contener lógica de negocio real.
- Este sandbox no debe guardar secretos en archivos versionados.
- **`settings.json`** y **`.env`** deben permanecer fuera de Git.
- **`settings.example.json`** y **`.env.example`** sí deben subirse como referencia.
- Los packages internos deben probarse aquí antes de integrarse a una app real.
- Por ahora este sandbox representa el contexto backend/API de **`J.A.R.V.I.S.`**.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
