<p align="center">
  <img src="./assets/images/branding/jarvis-logo.png" alt="J.A.R.V.I.S. Logo" width="360" />
</p>

---

## Introducción

**`J.A.R.V.I.S. | JavaScript Architecture Runtime for Versatile Intelligent Services`** es un proyecto modular, escalable y orientado a servicios, creado como núcleo tecnológico para aplicaciones empresariales modernas de **CLAIN México, S.A. de C.V.**

---

## Objetivo

El objetivo de **`J.A.R.V.I.S.`** es proporcionar un núcleo capaz de centralizar y estandarizar funcionalidades comunes para distintos proyectos, aplicaciones y servicios internos.

---

## Instalación

Para realizar la instalación de **`J.A.R.V.I.S.`**, se deben seguir los siguientes pasos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/CLAINMexico/JARVIS.git
```

### 2. Entrar al directorio del proyecto

```bash
cd JARVIS
```

### 3. Copiar el archivo de variables de entorno

```bash
cp .env.example .env
```

### 4. Levantar el ambiente de desarrollo

```bash
docker compose up -d --build
```

### 5. Instalar las dependencias del monorepo

```bash
docker compose exec jarvis-node pnpm install
```

### 6. Verificar la instalación

```bash
docker compose exec jarvis-node pnpm verify
```

Si el comando finaliza correctamente, el ambiente base de **`J.A.R.V.I.S.`** estará listo para desarrollo.

---

## Paquetes

Los paquetes de **`J.A.R.V.I.S.`** representan capacidades internas del ecosistema, diseñados para separar responsabilidades y mantener una arquitectura limpia, escalable y reutilizable.

Cada paquete cumple una función específica dentro del runtime o dentro del flujo de una aplicación, permitiendo que el proyecto crezca de forma ordenada sin concentrar toda la lógica en un solo lugar.

Con esta estructura, **`J.A.R.V.I.S.`** puede integrar nuevos paquetes de forma progresiva, como seguridad, base de datos, almacenamiento, notificaciones y cliente frontend, manteniendo siempre una separación clara entre cada capacidad del sistema.

Dentro del proyecto se mantiene una diferencia importante:

```txt
packages       = paquetes físicos y configurables del monorepo
runtimeModules = módulos vivos registrados dentro de @jarvis/core
modules        = módulos reportados por el runtime
```

### @jarvis/core

Paquete principal encargado de gestionar el núcleo del runtime. Arranca una instancia de **`J.A.R.V.I.S.`**, registra módulos, ejecuta el ciclo de vida y expone servicios internos del runtime.

### @jarvis/config

Paquete principal para cargar, normalizar y exponer configuración para aplicaciones que usen el runtime de **`J.A.R.V.I.S.`**.

### @jarvis/bootstrap

Paquete principal encargado de preparar la configuración inicial de una app antes de arrancar el runtime de **`J.A.R.V.I.S.`**.

### @jarvis/logger

Paquete principal para gestionar el registro de eventos, bitácoras, errores y mensajes de diagnóstico generados durante la ejecución del runtime de **`J.A.R.V.I.S.`**.

### @jarvis/http

Paquete base para construir respuestas HTTP exitosas, errores controlados, códigos de estado y códigos internos de error con una estructura estándar.

### @jarvis/security

Paquete base de seguridad para firmar, verificar y validar tokens JWT dentro del ecosistema **`J.A.R.V.I.S.`**.

---

## Scripts

```bash
docker compose exec jarvis-node pnpm clean
docker compose exec jarvis-node pnpm build
docker compose exec jarvis-node pnpm typecheck
docker compose exec jarvis-node pnpm dev
docker compose exec jarvis-node pnpm verify
```

El comando **`docker compose exec jarvis-node pnpm verify`** ejecuta:

```txt
clean
build
typecheck
dev
```

---

## Licencia

Este proyecto es privado y propietario.

Copyright (c) CLAIN México, S.A. de C.V.

Todos los derechos reservados.
