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

```txt
Core define reglas.
Packages implementan capacidades.
Bootstrap prepara la app.
Apps conectan y prueban el ecosistema.
```

---

## Packages actuales

### @jarvis/core

Núcleo principal del runtime. Arranca una instancia de **`J.A.R.V.I.S.`**, registra módulos vivos, ejecuta ciclo de vida y expone servicios mediante **`core.service()`**.

### @jarvis/config

Package de configuración. Carga **`settings.json`**, crea **`ConfigService`** y permite consultas por path.

### @jarvis/bootstrap

Prepara una app antes de arrancar el runtime. Lee **`settings.json`**, crea **`ConfigService`**, normaliza **`app`**, **`server`** y **`logger`**.

### @jarvis/logger

Sistema oficial de logging. Escribe logs en consola y archivos, usando niveles, zona horaria, metadata en JSON, archivo **`ALL.log`** y archivos separados por nivel.

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

```bash
docker compose exec jarvis-node pnpm dev
docker compose exec jarvis-node pnpm build
docker compose exec jarvis-node pnpm typecheck
docker compose exec jarvis-node pnpm clean
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
- Bootstrap inicial.
- Logging en consola y archivos.
- Metadata de logs como JSON legible.
- Switch maestro **`modules.logger.enabled`** funcionando.

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
