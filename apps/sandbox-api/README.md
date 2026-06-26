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
- Prueba de **`modules.logger.enabled`** como switch maestro.

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

## Logger

El sandbox permite validar tres niveles de control del logger:

```txt
modules.logger.enabled
modules.logger.console.enabled
modules.logger.file.enabled
```

### Switch maestro

Cuando **`modules.logger.enabled`** está en **`false`**, el logger no debe escribir en consola ni archivos, aunque los transports esten habilitados.

```json
{
  "modules": {
    "logger": {
      "enabled": false,
      "level": "debug",
      "console": {
        "enabled": true,
        "colors": true
      },
      "file": {
        "enabled": true,
        "path": "./logs",
        "splitByLevel": true,
        "writeAll": true
      }
    }
  }
}
```

Resultado esperado:

```txt
Sin salida de logger en consola.
Sin carpeta logs.
LoggerService disponible desde core.service('logger').
```

### Consola apagada

```txt
modules.logger.enabled = true
modules.logger.console.enabled = false
modules.logger.file.enabled = true
```

Resultado esperado:

```txt
Sin salida de logger en consola.
Con archivos de log.
LoggerService disponible.
```

### Archivo apagado

```txt
modules.logger.enabled = true
modules.logger.console.enabled = true
modules.logger.file.enabled = false
```

Resultado esperado:

```txt
Con salida de logger en consola.
Sin archivos de log.
LoggerService disponible.
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

## Validacion manual de logger

Antes de probar combinaciones, limpiar logs previos:

```bash
docker compose exec jarvis-node rm -rf apps/sandbox-api/logs
```

Despues ejecutar:

```bash
docker compose exec jarvis-node pnpm verify
```

Para confirmar si se crearon archivos:

```bash
docker compose exec jarvis-node ls apps/sandbox-api/logs
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
- Validar **`enabled`** de modulo, consola y archivo.

---

## Notas para desarrollo

- Este sandbox no debe contener lógica de negocio real.
- **`settings.json`** y **`.env`** deben permanecer fuera de Git.
- **`settings.example.json`** y **`.env.example`** sí deben subirse como referencia.
- **`logs/`** y **`*.log`** deben permanecer fuera de Git.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
