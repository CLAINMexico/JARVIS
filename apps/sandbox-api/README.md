## Sandbox API

**`Sandbox API`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este sandbox no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de **`@jarvis/core`** y de los packages que se vayan integrando al runtime.

---

## Objetivo

El objetivo de **`Sandbox API`** es validar que **`J.A.R.V.I.S.`** pueda arrancar, montar módulos reales, preparar configuración inicial, registrar servicios y ejecutar su ciclo de vida desde el contexto de una app backend.

Actualmente permite validar:

- Arranque de una instancia del core mediante **`Jarvis.boot()`**.
- Bootstrap inicial mediante **`@jarvis/bootstrap`**.
- Lectura de configuración mediante **`@jarvis/config`**.
- Logging en consola y archivos mediante **`@jarvis/logger`**.
- Registro de servicios internos mediante **`core.service()`**.
- Ejecución de módulos mediante **`boot()`**.
- Apagado ordenado mediante **`shutdown()`**.
- Normalización de app, server y logger desde **`settings.json`**.
- Escritura de metadata como JSON legible.

---

## Flujo actual

```txt
createJarvisBootstrap()
↓
createConfigModule()
↓
createLoggerModule()
↓
Jarvis.boot()
↓
core.bootModules()
↓
core.service('config')
↓
core.service('logger')
↓
core.shutdown()
```

---

## Configuración

Para preparar la configuración local, copiar los archivos de ejemplo:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

---

## Logging

Cuando **`@jarvis/logger`** está habilitado, el sandbox puede escribir logs en consola y archivos.

Los archivos se generan en:

```txt
apps/sandbox-api/logs/YYYY/MM/DD/
```

Archivos esperados:

```txt
YYYY_MM_DD_JARVIS_SANDBOXAPI_ALL.log
YYYY_MM_DD_JARVIS_SANDBOXAPI_DEBUG.log
YYYY_MM_DD_JARVIS_SANDBOXAPI_INFO.log
YYYY_MM_DD_JARVIS_SANDBOXAPI_WARN.log
YYYY_MM_DD_JARVIS_SANDBOXAPI_ERROR.log
YYYY_MM_DD_JARVIS_SANDBOXAPI_FATAL.log
```

El archivo **`ALL.log`** concentra el flujo completo de ejecución.

---

## Ejecución

Desde la raíz del monorepo:

```bash
docker compose exec jarvis-node pnpm dev
```

Para validación completa:

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

## Scripts disponibles

### Desarrollo desde la raíz

```bash
docker compose exec jarvis-node pnpm dev
```

### Verificación completa

```bash
docker compose exec jarvis-node pnpm verify
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
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api run clean
```

---

## Estado actual

Actualmente **`sandbox-api`** ya puede:

- Arrancar una instancia de **`J.A.R.V.I.S.`**.
- Usar **`@jarvis/core`**.
- Usar **`@jarvis/config`**.
- Usar **`@jarvis/bootstrap`**.
- Usar **`@jarvis/logger`**.
- Montar módulos vivos mediante **`runtimeModules`**.
- Obtener servicios mediante **`core.service()`**.
- Ejecutar **`bootModules()`**.
- Ejecutar **`shutdown()`**.
- Cargar **`settings.json`**.
- Normalizar app, server y logger.
- Generar logs en consola.
- Generar logs en archivos.
- Imprimir metadata como JSON legible.

---

## Notas para desarrollo

- Este sandbox no debe contener lógica de negocio real.
- **`settings.json`** y **`.env`** deben permanecer fuera de Git.
- **`settings.example.json`** y **`.env.example`** sí deben subirse como referencia.
- **`logs/`** y **`*.log`** deben permanecer fuera de Git.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
