# J.A.R.V.I.S.
JavaScript Architecture Runtime for Versatile Intelligent Services

⸻

## Objetivo

**`J.A.R.V.I.S.`** es un proyecto backend modular, escalable y orientado a servicios, creado como núcleo tecnológico para aplicaciones empresariales modernas.

Este proyecto nace como una base sólida para construir APIs, servicios, integraciones, almacenamiento, seguridad, notificaciones y futuras arquitecturas basadas en microservicios.

El objetivo de **`J.A.R.V.I.S.`** es proporcionar un kernel backend capaz de centralizar y estandarizar funcionalidades comunes para distintos proyectos, aplicaciones y servicios internos.

Entre sus responsabilidades principales se contemplan:

* Levantamiento de servicios backend con Node.js, TypeScript y Fastify.
* Administración de configuración por ambiente.
* Seguridad basada en JWT, roles, permisos y políticas.
* Conexión con múltiples motores de base de datos.
* Manejo de almacenamiento de archivos.
* Envío de notificaciones multicanal.
* Licenciamiento y activación de paquetes.
* Cliente SDK para consumo desde frontends o PWAs.
* Preparación para arquitecturas modulares y microservicios.

⸻

## Stack

El stack principal definido para el proyecto es:

* Node.js
* TypeScript
* Fastify
* pnpm
* Docker
* Docker Compose

⸻

## Arquitectura

**`J.A.R.V.I.S.`** será desarrollado como un monorepo compuesto por distintos paquetes independientes.

Estructura conceptual inicial:

```
jarvis/
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

⸻

## Paquetes contemplados

#### @jarvis/core

Núcleo principal del framework/kernel.
Responsable de inicializar el runtime, cargar configuración, registrar módulos, levantar Fastify y coordinar el ecosistema interno.

#### @jarvis/config

Administración de configuración, variables de entorno y perfiles por ambiente.

#### @jarvis/logger

Sistema centralizado de logs, trazabilidad y diagnóstico.

#### @jarvis/license

Validación de licenciamiento, activación, planes, paquetes disponibles y restricciones de uso.

#### @jarvis/security

Seguridad, autenticación, autorización, JWT, roles, permisos, auditoría y políticas de acceso.

#### @jarvis/database

Capa de datos para conexiones, consultas, recursos y drivers de base de datos.

Drives Integrados:

- **`@jarvis/database-mssql`**
- **`@jarvis/database-postgresql`**
- **`@jarvis/database-mysql`**
- **`@jarvis/database-mongodb`**
- **`@jarvis/database-redis`**
- **`@jarvis/database-firebase`**
- **`@jarvis/database-firebird`**

#### @jarvis/storage

Capa de almacenamiento para archivos, baúles, carpetas, metadatos y providers externos.

Providers Integrados:

- **`@jarvis/storage-local`**
- **`@jarvis/storage-s3`**
- **`@jarvis/storage-azure`**
- **`@jarvis/storage-gdrive`**
- **`@jarvis/storage-onedrive`**
- **`@jarvis/storage-minio`**

#### @jarvis/notify

Sistema de notificaciones multicanal.

Canales Integrados:

- **`email`**
- **`push`**
- **`sms`**
- **`whatsapp`**
- **`in-app`**
- **`webhooks`**

#### @jarvis/client

SDK cliente para consumir APIs de **`J.A.R.V.I.S.`** desde frontends, PWAs, apps móviles u otros sistemas.

⸻

## Ambiente de desarrollo

El ambiente oficial de desarrollo será Docker.

La intención es que cualquier desarrollador pueda clonar el repositorio y levantar el mismo entorno sin depender de configuraciones particulares de su sistema operativo.

Ambientes objetivo:

- **`macOS`**
- **`Linux`**
- **`Windows`**

## Servicios contemplados para desarrollo:

- **`jarvis-node`**
- **`jarvis-postgres`**
- **`jarvis-mssql`**
- **`jarvis-mysql`**
- **`jarvis-redis`**
- **`jarvis-mongo`**
- **`jarvis-mailpit`**
- **`jarvis-minio`**

⸻

## Convención de Docker

La nomenclatura base para el ambiente de desarrollo será:

**`clainmexico-jarvis-development-environment`**

Servicios:

- **`jarvis-node`**
- **`jarvis-postgres`**
- **`jarvis-redis`**
- **`jarvis-mailpit`**

Servicios adicionales bajo perfiles:

- **`jarvis-mssql`**
- **`jarvis-mysql`**
- **`jarvis-mongo`**
- **`jarvis-minio`**

⸻

## Instalación inicial

Esta sección será actualizada conforme avance la implementación.

Clonar el repositorio:

```cmd
git clone <repository-url>
cd jarvis
```

Copiar variables de entorno:

```cmd
cp .env.example .env
````

Levantar ambiente Docker:

```cmd
docker compose up -d --build
```

Validar contenedores:

```cmd
docker compose ps
```

Validar Node y pnpm dentro del contenedor:

```cmd
docker compose exec jarvis-node node -v
docker compose exec jarvis-node pnpm -v
```

⸻

## Package manager

El package manager oficial será:

- **`pnpm`**

El proyecto utilizará pnpm workspaces para administrar los paquetes internos del monorepo.

⸻

## Filosofía del proyecto

**`J.A.R.V.I.S.`** se construirá bajo los siguientes principios:

- Modularidad.
- Escalabilidad.
- Seguridad por capas.
- Código limpio.
- Separación clara de responsabilidades.
- Entorno reproducible.
- Paquetes independientes.
- Preparación para microservicios.
- Documentación progresiva.
- Cero dependencia del “en mi máquina sí funciona”.

⸻

## API objetivo

Las APIs de **`J.A.R.V.I.S.`** seguirán una nomenclatura limpia y versionada:

```
https://api.midominio.com/v1/modulo/resource
https://api.midominio.com/v1/modulo/resource/id
```

Ejemplo conceptual:

```
GET https://api.midominio.com/v1/database/resources/clientes/1
GET https://api.midominio.com/v1/storage/vaults/facturas/files
POST https://api.midominio.com/v1/notify/email/send
```

⸻

## Seguridad

Toda petición desde frontend hacia backend deberá utilizar **`JWT`** como capa base de autenticación.

Capas contempladas:

- HTTPS.
- CORS controlado.
- Rate limit.
- JWT.
- Refresh token.
- Sesiones activas.
- Roles y permisos.
- Resource policies.
- Validación de entrada.
- Sanitización.
- Audit log.
- Respuestas de error seguras.

⸻

## Licencia

Este proyecto es privado y propietario.

Copyright (c) CLAIN México, S.A. de C.V.
Todos los derechos reservados.

⸻

## Nota

**`J.A.R.V.I.S.`** se encuentra en una etapa temprana de desarrollo.
La estructura, paquetes y convenciones pueden evolucionar conforme avance la arquitectura del proyecto.
