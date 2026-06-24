## Sandbox API

Sandbox API es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este proyecto no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de **`@jarvis/core`** y de los paquetes que se vayan integrando al runtime.

---

## Objetivo

Validar que **`J.A.R.V.I.S.`** pueda:

* Arrancar una instancia del core.
* Recibir configuración inicial.
* Registrar módulos informativos.
* Ejecutar módulos vivos del runtime.
* Probar el ciclo de vida de módulos mediante boot() y shutdown().
* Servir como punto de integración para futuros paquetes como **`@jarvis/config`**, **`@jarvis/logger`**, **`@jarvis/database`**, **`@jarvis/security`**, **`@jarvis/storage`** y **`@jarvis/notify`**.

---

## Rol dentro del monorepo

Esta aplicación vive dentro de:

```
apps/sandbox-api
```

y forma parte del monorepo de **`J.A.R.V.I.S.`**

Su función principal es probar cómo una API real consumiría los paquetes internos del ecosistema **`J.A.R.V.I.S.`**

---

## Archivos importantes

```
apps/sandbox-api/
  src/
    main.ts
  settings.example.json
  .env.example
  package.json
  tsconfig.json
  README.md
```

---

## src/main.ts

Archivo principal de ejecución del sandbox.

Actualmente se usa para probar:

- Jarvis.boot()
- core.bootModules()
- core.info()
- core.shutdown()
- Registro de módulos simples.
- Registro de módulos vivos mediante runtimeModules.

---

## settings.example.json

Archivo de ejemplo con la estructura base de configuración de una app que usa **`J.A.R.V.I.S.`**

---

## .env.example

Plantilla de variables de entorno requeridas por la aplicación.

---

## .env

Archivo local con valores reales o sensibles.

---

## settings.json

Archivo local de configuración real de la app.

---

## Configuración

Para preparar la configuración local, copia los archivos de ejemplo:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

Después ajusta los valores reales en:

```
apps/sandbox-api/settings.json
apps/sandbox-api/.env
```

---

## Reglas de configuración

**`settings.json`** debe contener configuración no sensible y referencias a secretos.

Ejemplo:

```json
{
  "security": {
    "jwt": {
      "secretRef": "SETTINGS_SECURITY_JWT_SECRET"
    }
  }
}
```

**`.env`** debe contener los valores reales:

```env
SETTINGS_SECURITY_JWT_SECRET=
```

---

## Ejecución

Desde la raíz del monorepo, ejecutar:

```bash
docker compose exec jarvis-node pnpm dev
```

Este comando ejecuta el script raíz del monorepo, el cual compila **`@jarvis/core`** y después levanta **`@jarvis/sandbox-api`**.

---

## Typecheck

Validar TypeScript del sandbox:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api typecheck
```

---

## Validar TypeScript del core:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/core typecheck
```

---

## Build

Compilar el sandbox:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api build
```

---

## Notas importantes

- Este sandbox no debe contener lógica de negocio real.
- Este sandbox no debe guardar secretos en archivos versionados.
- settings.json y .env deben permanecer fuera de Git.
- settings.example.json y .env.example sí deben subirse como referencia.
- Los paquetes internos deben probarse aquí antes de integrarse a una app real.
- Por ahora este sandbox representa el contexto backend/API de **`J.A.R.V.I.S.`**

---

## Futuro

Este sandbox será usado para probar la integración progresiva de:

- **`@jarvis/config`**
- **`@jarvis/logger`**
- **`@jarvis/license`**
- **`@jarvis/security`**
- **`@jarvis/database`**
- **`@jarvis/storage`**
- **`@jarvis/notify`**

Más adelante podrán existir otros sandboxes por tipo de aplicación, por ejemplo:

```
apps/sandbox-pwa
apps/sandbox-worker
apps/sandbox-cli
```
