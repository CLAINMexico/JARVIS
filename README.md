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

Este proyecto nace como una base sólida para construir APIs, servicios, integraciones, almacenamiento, seguridad, notificaciones, licenciamiento y futuras arquitecturas basadas en microservicios.

---

## Objetivo

El objetivo de **`J.A.R.V.I.S.`** es proporcionar un kernel backend capaz de centralizar y estandarizar funcionalidades comunes para distintos proyectos, aplicaciones y servicios internos.

En palabras simples:

```txt
J.A.R.V.I.S. será el núcleo backend reutilizable.
```

Entre sus responsabilidades principales se contemplan:

- Levantamiento de servicios backend con **`Node.js`**, **`TypeScript`** y **`Fastify`**.
- Administración de configuración por ambiente.
- Registro y consulta de servicios internos expuestos por módulos.
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
Apps conectan y prueban el ecosistema.
```

A partir de **`v0.8.0`**, el core también puede registrar servicios expuestos por módulos vivos para que una app los consulte desde una única instancia del runtime.

Ejemplo conceptual:

```ts
const config = core.service('config');
```

Estructura conceptual:

```txt
JARVIS/
  apps/
    sandbox-api/
  packages/
    core/
    config/
    logger/
    license/
    security/
    database/
    storage/
    notify/
    client/
  docker/
    node/
    postgres/
    mysql/
    mssql/
    mongo/
  examples/
  tools/
```

---

## Estructura actual

La estructura actual del proyecto incluye:

```txt
JARVIS/
  apps/
    sandbox-api/
  assets/
    images/
      branding/
        jarvis-logo.png
  docker/
    node/
  packages/
    core/
    config/
  .env.example
  .gitignore
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  README.md
```

---

## Apps actuales

### apps/sandbox-api

**`sandbox-api`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Actualmente permite validar:

- Arranque del core.
- Registro de módulos.
- Ciclo de vida de módulos.
- Registro inicial de services dentro de **`@jarvis/core`**.
- Integración de packages reales.
- Lectura de configuración mediante **`@jarvis/config`**.
- Consulta de **`ConfigService`** mediante **`core.service('config')`**.
- Uso de archivos **`settings.json`** y **`.env`** por app.

---

## Packages actuales

### @jarvis/core

**`@jarvis/core`** es el núcleo principal del runtime.

Responsable de:

- Arrancar una instancia de **`J.A.R.V.I.S.`**.
- Normalizar configuración inicial.
- Registrar módulos informativos.
- Registrar módulos vivos.
- Registrar services expuestos por módulos vivos.
- Permitir consulta de services mediante **`core.service(name)`**.
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
- Exponer **`ConfigService`** para que pueda ser registrado por **`@jarvis/core`**.

---

## Packages contemplados

### @jarvis/logger

Sistema centralizado de logs, trazabilidad y diagnóstico.

### @jarvis/license

Validación de licenciamiento, activación, planes, paquetes disponibles y restricciones de uso.

### @jarvis/security

Seguridad, autenticación, autorización, **`JWT`**, roles, permisos, auditoría y políticas de acceso.

### @jarvis/database

Capa de datos para conexiones, consultas, recursos y drivers de base de datos.

Drivers contemplados:

- **`@jarvis/database-mssql`**
- **`@jarvis/database-postgresql`**
- **`@jarvis/database-mysql`**
- **`@jarvis/database-mongodb`**
- **`@jarvis/database-redis`**
- **`@jarvis/database-firebase`**
- **`@jarvis/database-firebird`**

### @jarvis/storage

Capa de almacenamiento para archivos, baúles, carpetas, metadatos y providers externos.

Providers contemplados:

- **`@jarvis/storage-local`**
- **`@jarvis/storage-s3`**
- **`@jarvis/storage-azure`**
- **`@jarvis/storage-gdrive`**
- **`@jarvis/storage-onedrive`**
- **`@jarvis/storage-minio`**

### @jarvis/notify

Sistema de notificaciones multicanal.

Channels contemplados:

- **`email`**
- **`push`**
- **`sms`**
- **`whatsapp`**
- **`in-app`**
- **`webhooks`**

### @jarvis/client

SDK cliente para consumir APIs de **`J.A.R.V.I.S.`** desde frontends, PWAs, apps móviles u otros sistemas.

---

## Ambiente de desarrollo

El ambiente oficial de desarrollo será **`Docker`**.

La intención es que cualquier desarrollador pueda clonar el repositorio y levantar el mismo entorno sin depender de configuraciones particulares de su sistema operativo.

Ambientes objetivo:

- **`macOS`**
- **`Linux`**
- **`Windows`**

---

## Servicios de desarrollo

Servicios base:

- **`jarvis-node`**
- **`jarvis-postgres`**
- **`jarvis-redis`**
- **`jarvis-mailpit`**

Servicios adicionales bajo perfiles:

- **`jarvis-mssql`**
- **`jarvis-mysql`**
- **`jarvis-mongo`**
- **`jarvis-minio`**

---

## Convención de Docker

La nomenclatura base para el ambiente de desarrollo es:

```txt
clainmexico-jarvis-development-environment
```

La convención general es:

```txt
project name = clainmexico-jarvis-development-environment
services     = jarvis-*
```

Ejemplos:

```txt
jarvis-node
jarvis-postgres
jarvis-redis
jarvis-mailpit
```

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

Validar contenedores:

```bash
docker compose ps
```

Validar Node y pnpm dentro del contenedor:

```bash
docker compose exec jarvis-node node -v
docker compose exec jarvis-node pnpm -v
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

Regla principal:

```txt
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
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

### @jarvis/sandbox-api

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api build
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api typecheck
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api clean
```

---

## Gestor de paquetes

El gestor de paquetes oficial es:

```txt
pnpm
```

El proyecto utiliza **`pnpm workspaces`** para administrar los packages internos del monorepo.

Regla de dependencias internas:

```json
"@jarvis/core": "workspace:*"
```

Regla de dependencias externas:

```json
"typescript": "^5.7.0"
```

---

## Filosofía del proyecto

**`J.A.R.V.I.S.`** se construirá bajo los siguientes principios:

- Modularidad.
- Escalabilidad.
- Seguridad por capas.
- Código limpio.
- Separación clara de responsabilidades.
- Entorno reproducible.
- Packages independientes.
- Preparación para microservicios.
- Documentación progresiva.
- Cero dependencia del “en mi máquina sí funciona”.

---

## API objetivo

Las APIs de **`J.A.R.V.I.S.`** seguirán una nomenclatura limpia y versionada:

```txt
https://api.midominio.com/v1/modulo/resource
https://api.midominio.com/v1/modulo/resource/id
```

Ejemplos conceptuales:

```txt
GET https://api.midominio.com/v1/database/resources/clientes/1
GET https://api.midominio.com/v1/storage/vaults/facturas/files
POST https://api.midominio.com/v1/notify/email/send
```

---

## Seguridad

Toda petición desde frontend hacia backend deberá utilizar **`JWT`** como capa base de autenticación.

Capas contempladas:

- **`HTTPS`**
- **`CORS`** controlado.
- **`Rate limit`**.
- **`JWT`**.
- **`Refresh token`**.
- Sesiones activas.
- Roles y permisos.
- Resource policies.
- Validación de entrada.
- Sanitización.
- Audit log.
- Respuestas de error seguras.

Reglas base:

```txt
Nunca confiar en el front.
Nunca confiar solo en el token.
Nunca exponer secretos.
Nunca ejecutar recursos no registrados.
Nunca devolver errores internos.
```

---

## Configuración y secretos

**`J.A.R.V.I.S.`** separa configuración de secretos.

```txt
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
```

Ejemplo en **`settings.json`**:

```json
{
  "database": {
    "passwordRef": "SETTINGS_DATABASE_PASSWORD"
  }
}
```

Ejemplo en **`.env`**:

```env
SETTINGS_DATABASE_PASSWORD=
```

Los archivos **`.env`** y **`settings.json`** reales no deben subirse a Git.

---

## Versionado

El proyecto usa tags semánticos para marcar avances importantes.

Ejemplos:

```txt
v0.6.0 = Ciclo de vida inicial de módulos
v0.7.0 = Primer módulo real de configuración
v0.8.0 = Registro inicial de servicios en core
```

Mientras el proyecto esté en etapa temprana, los packages principales pueden alinearse con la versión del release del monorepo.

---

## Convenciones

### Commits

Los commits deben escribirse en español usando prefijos tipo Conventional Commits.

Ejemplos:

```bash
git commit -m "feat: agregar primer módulo real de configuración"
git commit -m "docs: homologar documentación de packages"
git commit -m "fix: corregir carga de settings.json"
```

### Documentación

La documentación debe mantenerse en español.

Reglas:

- Todo nuevo package debe tener **`README.md`**.
- Toda nueva app o sandbox debe tener **`README.md`**.
- Los comentarios importantes dentro del código deben estar en español.

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
import type { JarvisOptions } from './contracts/jarvis-options.js';
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
```

---

## Estado actual

Actualmente **`J.A.R.V.I.S.`** ya cuenta con:

- Monorepo con **`pnpm workspaces`**.
- Ambiente Docker base.
- Package **`@jarvis/core`**.
- Package **`@jarvis/config`**.
- App interna **`sandbox-api`**.
- Ciclo de vida inicial de módulos.
- Primer package real montado por el core.
- Registro inicial de services dentro de **`@jarvis/core`**.
- Consulta de services mediante **`core.service(name)`**.
- Lectura de **`settings.json`** desde **`@jarvis/config`**.
- Consulta de configuración mediante **`core.service('config')`**.
- Documentación base por package y sandbox.

---

## Roadmap inmediato

Próximos pasos contemplados:

- Crear package **`@jarvis/logger`**.
- Integrar logger como segundo módulo real.
- Reemplazar logs de prueba por un servicio de logger.
- Preparar integración inicial con **`Fastify`**.
- Expandir validación de configuración.
- Resolver referencias hacia **`.env`** desde **`@jarvis/config`**.

---

## Licencia

Este proyecto es privado y propietario.

Copyright (c) CLAIN México, S.A. de C.V.

Todos los derechos reservados.

---

## Nota

**`J.A.R.V.I.S.`** se encuentra en una etapa temprana de desarrollo.

La estructura, packages y convenciones pueden evolucionar conforme avance la arquitectura del proyecto.
