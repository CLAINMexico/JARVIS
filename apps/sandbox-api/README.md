## Introducción

**`Sandbox API`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este sandbox no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de los paquetes que se vayan integrando al runtime.

---

## Objetivo

El objetivo de **`Sandbox API`** es validar que **`J.A.R.V.I.S.`** pueda arrancar, montar módulos reales, preparar configuración inicial, registrar servicios y ejecutar su ciclo de vida desde el contexto de una aplicación backend.

---

## Configuración

Para preparar la configuración local, se deben copiar los archivos de ejemplo:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

El archivo **`settings.json`** contiene configuración no sensible de la aplicación, mientras que el archivo **`.env`** debe contener valores sensibles o secretos locales.

---

## Ejecución

Para ejecutar **`Sandbox API`** desde la raíz del monorepo:

```bash
docker compose exec jarvis-node pnpm dev
```

---

## Validación

Para validar el flujo completo del proyecto:

```bash
docker compose exec jarvis-node pnpm verify
```

El comando **`verify`** ejecuta:

```txt
clean
build
typecheck
dev
```

Si la validación finaliza correctamente, significa que **`Sandbox API`** puede arrancar usando los paquetes actuales de **`J.A.R.V.I.S.`**.
