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

---

## Objetivo

El objetivo de **`J.A.R.V.I.S.`** es proporcionar un kernel backend capaz de centralizar y estandarizar funcionalidades comunes para distintos proyectos, aplicaciones y servicios internos.

Responsabilidades contempladas:

- Levantamiento de servicios backend con **`Node.js`**, **`TypeScript`** y **`Fastify`**.
- Preparación inicial de aplicaciones mediante **`@jarvis/bootstrap`**.
- Administración de configuración por ambiente mediante **`@jarvis/config`**.
- Sistema oficial de logging mediante **`@jarvis/logger`**.
- Registro de servicios expuestos por módulos vivos desde **`@jarvis/core`**.
- Preparación para arquitecturas modulares y microservicios.

---

## Arquitectura

La idea base es:

```txt
Core define reglas.
Packages implementan capacidades.
Bootstrap prepara la app.
Apps conectan y prueban el ecosistema.
```

---

## Packages actuales

### @jarvis/core

**`@jarvis/core`** es el núcleo principal del runtime.

Responsable de arrancar una instancia de **`J.A.R.V.I.S.`**, registrar módulos vivos, ejecutar ciclo de vida y exponer servicios mediante **`core.service()`**.

### @jarvis/config

**`@jarvis/config`** es el package de configuración.

Responsable de cargar **`settings.json`**, crear **`ConfigService`** y permitir consultas por path.

### @jarvis/bootstrap

**`@jarvis/bootstrap`** prepara una app antes de arrancar el runtime.

Responsable de leer **`settings.json`**, crear **`ConfigService`**, normalizar **`app`**, **`server`** y **`logger`**.

### @jarvis/logger

**`@jarvis/logger`** es el sistema oficial de logging.

Responsable de escribir logs en consola y archivos, usando niveles, zona horaria, metadata en JSON, archivo **`ALL.log`** y archivos separados por nivel.

---

## Flujo actual

```txt
settings.json
↓
@jarvis/bootstrap
↓
@jarvis/config
↓
@jarvis/logger
↓
@jarvis/core
↓
apps/sandbox-api
```

Ejemplo conceptual:

```ts
const jarvisBootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

const configModule = createConfigModule({
  values: jarvisBootstrap.settings
});

const loggerModule = createLoggerModule(jarvisBootstrap.logger);

const core = await Jarvis.boot({
  app: jarvisBootstrap.app,
  server: jarvisBootstrap.server,
  runtimeModules: [
    configModule,
    loggerModule
  ]
});
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

### Verify

```bash
docker compose exec jarvis-node pnpm verify
```

**`verify`** ejecuta:

```txt
clean
build
typecheck
dev
```

---

## Versionado

```txt
v0.7.0 = Primer módulo real de configuración
v0.8.0 = Registro inicial de servicios en core
v0.9.0 = Bootstrap inicial de aplicaciones
v0.10.0 = Primer módulo real de logger
```

---

## Archivos generados

No deben subirse a Git:

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
- Package **`@jarvis/logger`**.
- App interna **`sandbox-api`**.
- Ciclo de vida inicial de módulos.
- Registro inicial de servicios en core.
- Lectura de **`settings.json`**.
- Bootstrap inicial.
- Logging en consola y archivos.
- Metadata de logs como JSON legible.

---

## Convenciones

- Documentación en español.
- Commits en español.
- Todo nuevo package debe tener **`README.md`**.
- Toda nueva app o sandbox debe tener **`README.md`**.
- Comentarios útiles dentro del código deben estar en español.
- Imports ESM relativos deben usar extensión **`.js`**.

---

## Licencia

Este proyecto es privado y propietario.

Copyright (c) CLAIN México, S.A. de C.V.

Todos los derechos reservados.
