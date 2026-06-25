<p align="center">
  <img src="./assets/images/branding/jarvis-logo.png" alt="J.A.R.V.I.S. Logo" width="360" />
</p>

---

## J.A.R.V.I.S.

**`J.A.R.V.I.S.`** significa:

```txt
JavaScript Architecture Runtime for Versatile Intelligent Services
```

**`J.A.R.V.I.S.`** es un proyecto backend modular, escalable y orientado a servicios, creado como núcleo tecnológico para aplicaciones empresariales modernas de **CLAIN México, S.A. de C.V.**

Este proyecto nace como una base sólida para construir APIs, servicios, integraciones, configuración, bootstrap de aplicaciones, almacenamiento, seguridad, notificaciones, licenciamiento y futuras arquitecturas basadas en microservicios.

---

## Objetivo

El objetivo de **`J.A.R.V.I.S.`** es proporcionar un kernel backend capaz de centralizar y estandarizar funcionalidades comunes para distintos proyectos, aplicaciones y servicios internos.

En palabras simples:

```txt
J.A.R.V.I.S. será el núcleo backend reutilizable de CLAIN México.
```

Entre sus responsabilidades principales se contemplan:

- Levantamiento de servicios backend con **`Node.js`**, **`TypeScript`** y **`Fastify`**.
- Preparación inicial de aplicaciones mediante **`@jarvis/bootstrap`**.
- Administración de configuración por ambiente mediante **`@jarvis/config`**.
- Registro de servicios expuestos por módulos vivos desde **`@jarvis/core`**.
- Seguridad basada en **`JWT`**, roles, permisos y políticas.
- Conexión con múltiples motores de base de datos.
- Manejo de almacenamiento de archivos.
- Envío de notificaciones multicanal.
- Licenciamiento y activación de paquetes.
- Cliente SDK para consumo desde frontends o PWAs.
- Preparación para arquitecturas modulares y microservicios.

---

## Stack

El stack principal definido para el proyecto es:

- **`Node.js`**
- **`TypeScript`**
- **`Fastify`**
- **`pnpm`**
- **`Docker`**
- **`Docker Compose`**

---

## Arquitectura

**`J.A.R.V.I.S.`** será desarrollado como un monorepo compuesto por packages independientes y apps internas de prueba.

La idea base es:

```txt
Core define reglas.
Packages implementan capacidades.
Bootstrap prepara la app.
Apps conectan y prueban el ecosistema.
```

Estructura conceptual:

```txt
JARVIS/
  apps/
    sandbox-api/
  packages/
    core/
    config/
    bootstrap/
    logger/
    license/
    security/
    database/
    storage/
    notify/
    client/
  docker/
  examples/
  tools/
```

---

## Packages actuales

### @jarvis/core

**`@jarvis/core`** es el núcleo principal del runtime.

Responsable de:

- Arrancar una instancia de **`J.A.R.V.I.S.`**.
- Normalizar configuración inicial recibida.
- Registrar módulos informativos.
- Registrar módulos vivos.
- Registrar servicios expuestos por módulos vivos.
- Ejecutar **`boot()`** de módulos vivos.
- Ejecutar **`shutdown()`** en orden inverso.
- Exponer contratos base para otros packages.

### @jarvis/config

**`@jarvis/config`** es el package de configuración del ecosistema.

Responsable de:

- Cargar configuración desde objetos.
- Cargar configuración desde **`settings.json`**.
- Guardar valores en **`ConfigService`**.
- Consultar valores mediante paths como **`app.name`** o **`server.port`**.
- Exponer un módulo compatible con **`JarvisRuntimeModule`**.

### @jarvis/bootstrap

**`@jarvis/bootstrap`** es el package encargado de preparar una aplicación antes de arrancar el runtime.

Responsable de:

- Leer **`settings.json`** usando **`@jarvis/config`**.
- Crear un **`ConfigService`** listo para consultas.
- Normalizar datos de **`app`**.
- Normalizar datos de **`server`**.
- Normalizar configuración inicial de **`logger`**.
- Entregar valores listos para que una app pueda construir módulos y arrancar **`@jarvis/core`**.

---

## Apps actuales

### apps/sandbox-api

**`sandbox-api`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Actualmente permite validar:

- Arranque del core.
- Registro de módulos.
- Registro de servicios internos.
- Ciclo de vida de módulos.
- Integración de packages reales.
- Lectura de configuración mediante **`@jarvis/config`**.
- Bootstrap inicial mediante **`@jarvis/bootstrap`**.
- Uso de archivos **`settings.json`** y **`.env`** por app.

---

## Configuración y bootstrap

**`J.A.R.V.I.S.`** separa configuración de secretos.

```txt
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
```

El flujo recomendado para una app es:

```txt
@jarvis/bootstrap
↓
@jarvis/config
↓
settings.json
↓
valores normalizados para app/server/logger
↓
Jarvis.boot()
```

Ejemplo conceptual:

```ts
const bootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

const core = await Jarvis.boot({
  app: bootstrap.app,
  server: bootstrap.server,
  runtimeModules: [
    configModule
  ]
});
```

El objetivo de este flujo es mantener limpio a **`@jarvis/core`**.

Correcto:

```txt
@jarvis/bootstrap → @jarvis/config
@jarvis/bootstrap → @jarvis/core
```

Incorrecto:

```txt
@jarvis/core → @jarvis/config
@jarvis/core → @jarvis/bootstrap
```

---

## Ambiente de desarrollo

El ambiente oficial de desarrollo será **`Docker`**.

La intención es que cualquier desarrollador pueda clonar el repositorio y levantar el mismo entorno sin depender de configuraciones particulares de su sistema operativo.

---

## Instalación inicial

Clonar el repositorio:

```bash
git clone https://github.com/CLAINMexico/JARVIS.git
cd JARVIS
```

Copiar variables de entorno raíz:

```bash
cp .env.example .env
```

Levantar ambiente Docker:

```bash
docker compose up -d --build
```

Instalar dependencias del monorepo:

```bash
docker compose exec jarvis-node pnpm install
```

---

## Configuración de sandbox-api

Copiar archivos de configuración del sandbox:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

Los archivos reales no deben subirse a Git:

```txt
settings.json
.env
```

Las plantillas sí deben subirse:

```txt
settings.example.json
.env.example
```

---

## Scripts principales

### Desarrollo

```bash
docker compose exec jarvis-node pnpm dev
```

### Build

```bash
docker compose exec jarvis-node pnpm build
```

### Typecheck

```bash
docker compose exec jarvis-node pnpm typecheck
```

### Clean

```bash
docker compose exec jarvis-node pnpm clean
```

---

## Scripts por package

### @jarvis/core

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core build
docker compose exec jarvis-node pnpm --filter @jarvis/core typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/core clean
```

### @jarvis/config

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/config build
docker compose exec jarvis-node pnpm --filter @jarvis/config typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/config clean
```

### @jarvis/bootstrap

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap build
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/bootstrap clean
```

### @jarvis/logger

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/logger build
docker compose exec jarvis-node pnpm --filter @jarvis/logger typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/logger clean
```

### @jarvis/sandbox-api

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api build
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api clean
```

---

## Versionado

El proyecto usa tags semánticos para marcar avances importantes.

Ejemplos:

```txt
v0.7.0 = Primer módulo real de configuración
v0.8.0 = Registro inicial de servicios en core
v0.9.0 = Bootstrap inicial de aplicaciones
```

---

## Roadmap inmediato

Próximos pasos contemplados:

- Finalizar **`@jarvis/logger`** como primer módulo real de logging.
- Integrar **`@jarvis/logger`** con valores normalizados por **`@jarvis/bootstrap`**.
- Ajustar **`apps/sandbox-api/src/main.ts`** para usar bootstrap, config y logger integrados.
- Preparar integración inicial con **`Fastify`**.
- Expandir validación de configuración.
- Resolver referencias hacia **`.env`** desde **`@jarvis/config`** o un package especializado.

---

## Convenciones

### Commits

Los commits deben escribirse en español usando prefijos tipo Conventional Commits.

Ejemplos:

```bash
git commit -m "feat: agregar bootstrap inicial de aplicaciones"
git commit -m "docs: actualizar documentación de bootstrap"
git commit -m "fix: corregir normalización de configuración"
```

### Documentación

La documentación debe mantenerse en español.

Reglas:

- Todo nuevo package debe tener **`README.md`**.
- Toda nueva app o sandbox debe tener **`README.md`**.
- Los comentarios importantes dentro del código deben estar en español.
- Todo lo agregado a archivos debe ir documentado cuando ayude a entender intención, contratos o responsabilidades.

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

Ejemplo:

```ts
import type { BootstrapOptions } from './contracts/bootstrap-options.js';
```

---

## Archivos generados

Estos archivos o carpetas no deben subirse a Git:

```txt
node_modules/
dist/
build/
coverage/
.pnpm-store/
.turbo/
.DS_Store
logs/
*.log
```

---

## Estado actual

Actualmente **`J.A.R.V.I.S.`** ya cuenta con:

- Monorepo con **`pnpm workspaces`**.
- Ambiente Docker base.
- Package **`@jarvis/core`**.
- Package **`@jarvis/config`**.
- Package **`@jarvis/bootstrap`**.
- Package **`@jarvis/logger`** en construcción.
- App interna **`sandbox-api`**.
- Ciclo de vida inicial de módulos.
- Registro inicial de servicios en core.
- Lectura de **`settings.json`** desde **`@jarvis/config`**.
- Bootstrap inicial de aplicaciones desde **`@jarvis/bootstrap`**.
- Documentación base por package y sandbox.

---

## Licencia

Este proyecto es privado y propietario.

Copyright (c) CLAIN México, S.A. de C.V.

Todos los derechos reservados.

---

## Nota

**`J.A.R.V.I.S.`** se encuentra en una etapa temprana de desarrollo.

La estructura, packages y convenciones pueden evolucionar conforme avance la arquitectura del proyecto.
