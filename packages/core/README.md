## @jarvis/core

**`@jarvis/core`** es el package principal del runtime de **`J.A.R.V.I.S.`**

Este package define las bases centrales para arrancar una instancia de **`J.A.R.V.I.S.`**, registrar módulos, ejecutar ciclos de vida y exponer información del runtime.

---

## Objetivo

El objetivo de **`@jarvis/core`** es funcionar como el núcleo del ecosistema **`J.A.R.V.I.S.`**

Este package no debe contener lógica específica de base de datos, configuración, seguridad, almacenamiento, licenciamiento o notificaciones. Su responsabilidad es definir las reglas y mecanismos base para que otros packages puedan integrarse al runtime.

En palabras simples:

```
@jarvis/core define cómo vive J.A.R.V.I.S.
Los demás packages definen qué puede hacer J.A.R.V.I.S.
```

---

## Responsabilidades principales

**`@jarvis/core`** se encarga de:

- Arrancar una instancia del runtime mediante **`Jarvis.boot()`**.
- Normalizar opciones iniciales de arranque.
- Registrar módulos informativos.
- Registrar módulos vivos del runtime.
- Ejecutar el ciclo de vida inicial de módulos con **`bootModules()`**.
- Ejecutar apagado ordenado con **`shutdown()`**.
- Reportar información de la instancia mediante **`info()`**.
- Exponer contratos base para otros packages.

---

## Lo que NO debe hacer

**`@jarvis/core`** no debe encargarse directamente de:

- Leer archivos **`settings.json`**.
- Leer archivos **`.env`**.
- Conectarse a bases de datos.
- Enviar correos o notificaciones.
- Validar licencias.
- Firmar o validar JWT.
- Servir rutas HTTP directamente.
- Implementar lógica específica de negocio.

Esas responsabilidades deben vivir en packages especializados como:

- **`@jarvis/config`**
- **`@jarvis/logger`**
- **`@jarvis/license`**
- **`@jarvis/security`**
- **`@jarvis/database`**
- **`@jarvis/storage`**
- **`@jarvis/notify`**

---

## Ubicación dentro del monorepo

```
packages/core
```

---

## Estructura actual

```
packages/core/
  src/
    contracts/
      jarvis-info.ts
      jarvis-module.ts
      jarvis-options.ts
      jarvis-runtime-module.ts
    runtime/
      jarvis-application.ts
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

- **`Jarvis`**
- **`JarvisApplication`**
- **`JarvisInfo`**
- **`JarvisOptions`**
- **`JarvisAppOptions`**
- **`JarvisServerOptions`**
- **`JarvisEnvironment`**
- **`JarvisModuleInfo`**
- **`JarvisModuleOptions`**
- **`JarvisModuleStatus`**
- **`JarvisRuntimeModule`**

### src/runtime/jarvis-application.ts

Contiene la clase **`JarvisApplication`**.

Esta clase representa una instancia viva de **`J.A.R.V.I.S.`** y se encarga de:

- Guardar configuración interna normalizada.
- Registrar módulos informativos.
- Registrar módulos vivos.
- Ejecutar **`boot()`** de módulos vivos.
- Ejecutar **`shutdown()`** de módulos vivos.
- Reportar información del runtime mediante **`info()`**.

### src/contracts/jarvis-options.ts

Define las opciones aceptadas por **`Jarvis.boot()`**.

Incluye:

- Información de la app.
- Configuración del servidor.
- Módulos informativos.
- Módulos vivos del runtime.

### src/contracts/jarvis-info.ts

Define la estructura de información que devuelve **`core.info()`**.

### src/contracts/jarvis-module.ts

Define los contratos para módulos informativos.

Incluye:

- **`JarvisModuleOptions`**
- **`JarvisModuleInfo`**
- **`JarvisModuleStatus`**

### src/contracts/jarvis-runtime-module.ts

Define el contrato para módulos vivos del runtime.

Un módulo vivo puede tener comportamiento de ciclo de vida mediante:

- **`boot()`**
- **`shutdown()`**

---

## Uso básico

Ejemplo mínimo:

```ts
import { Jarvis } from '@jarvis/core';

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});

const info = core.info();

console.log(info.name);
console.log(info.app.name);
console.log(info.status);
```

---

## Uso con módulos informativos

Los módulos informativos solo registran nombre y estado.

```ts
import { Jarvis } from '@jarvis/core';

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  modules: [
    {
      name: 'license',
      status: 'disabled'
    },
    {
      name: 'database'
    }
  ]
});

console.log(core.modules());
```

Si un módulo no define **`status`**, **`J.A.R.V.I.S.`** usará:

```
registered
```

---

## Uso con módulos vivos

Los módulos vivos pueden ejecutar lógica durante el arranque y apagado.

```ts
import { Jarvis } from '@jarvis/core';

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
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
    }
  ]
});

await core.bootModules();

console.log(core.info());

await core.shutdown();
```

---

## Ciclo de vida de módulos

El ciclo actual es:

```
Jarvis.boot()
↓
core.bootModules()
↓
core.info()
↓
core.shutdown()
```

### bootModules()

Ejecuta el método **`boot()`** de cada módulo vivo registrado.

Los módulos se arrancan en el orden en el que fueron registrados.

```
config → logger → database
```

### shutdown()

Ejecuta el método **`shutdown()`** de cada módulo vivo registrado.

Los módulos se apagan en orden inverso.

```
database → logger → config
```

Esto ayuda a respetar dependencias simples entre módulos.

---

## Contrato JarvisRuntimeModule

Todo package que quiera conectarse al ciclo de vida del core debe implementar este contrato.

```ts
export interface JarvisRuntimeModule {
  name: string;
  boot?(): Promise<void> | void;
  shutdown?(): Promise<void> | void;
}
```

Ejemplo en un package externo como **`@jarvis/config`**:

```ts
import type { JarvisRuntimeModule } from '@jarvis/core';

export function createConfigModule(): JarvisRuntimeModule {
  return {
    name: 'config',
    boot() {
      console.log('[config] módulo iniciado');
    },
    shutdown() {
      console.log('[config] módulo apagado');
    }
  };
}
```

---

## Relación con otros packages

La relación correcta es:

```
@jarvis/core
= define contratos y mecanismos base

@jarvis/config
= implementa un módulo compatible con el core

@jarvis/logger
= implementa un módulo compatible con el core

@jarvis/database
= implementa un módulo compatible con el core

apps/sandbox-api
= conecta el core con los módulos reales
```

Regla importante:

```
Core define reglas.
Packages implementan reglas.
Apps conectan packages con core.
```

---

## Decisión arquitectónica importante

**`@jarvis/core`** no debe depender de packages concretos como **`@jarvis/config`** o **`@jarvis/database`**.

Los packages concretos sí pueden depender de **`@jarvis/core`** para implementar sus contratos.

Correcto:

```
@jarvis/config → @jarvis/core
@jarvis/logger → @jarvis/core
@jarvis/database → @jarvis/core
```

Incorrecto:

```
@jarvis/core → @jarvis/config
@jarvis/core → @jarvis/database
```

Esto evita dependencias circulares y mantiene el core limpio.

---

## Scripts disponibles

### Build

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core clean
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

Dentro de **`@jarvis/core`** se usa prefijo **`jarvis-*`** porque este package define conceptos propios del runtime principal.

Ejemplos:

```
jarvis-options.ts
jarvis-info.ts
jarvis-module.ts
jarvis-runtime-module.ts
jarvis-application.ts
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
import type { JarvisOptions } from './contracts/jarvis-options.js';
```

---

## Estado actual

Actualmente **`@jarvis/core`** ya puede:

- Bootear una instancia de **`J.A.R.V.I.S.`**.
- Normalizar opciones iniciales.
- Registrar módulos simples.
- Registrar módulos vivos.
- Ejecutar **`boot()`** en módulos vivos.
- Ejecutar **`shutdown()`** en orden inverso.
- Reportar información mediante **`info()`**.
- Exponer contratos públicos para futuros packages.

## Notas para desarrollo

- No meter lógica específica de negocio en **`@jarvis/core`**.
- No leer secretos directamente desde este package.
- No acoplar el core a packages concretos.
- No romper el contrato **`JarvisRuntimeModule`**.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
