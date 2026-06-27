## Introducción

**`Sandbox-API`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este sandbox no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de los paquetes que se vayan integrando al runtime.

---

## Objetivo

El objetivo de **`Sandbox-API`** es validar que **`J.A.R.V.I.S.`** pueda arrancar, montar módulos reales, preparar configuración inicial, registrar servicios y ejecutar su ciclo de vida desde el contexto de una aplicación backend.

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

Para ejecutar **`Sandbox-API`** desde la raíz del monorepo:

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

Si la validación finaliza correctamente, significa que **`Sandbox-API`** puede arrancar usando los paquetes actuales de **`J.A.R.V.I.S.`**.

## Configuración HTTP/HTTPS

**`Sandbox-API`** puede arrancar usando **HTTP** o **HTTPS** según la configuración declarada en **`settings.json`**.

La configuración del servidor es leída por **`@jarvis/bootstrap`**, normalizada por **`@jarvis/core`** y consumida por **`Sandbox-API`** desde **`core.info().server`**.

---

## Configuración HTTP

Para arrancar en HTTP:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "protocol": "http",
    "https": {
      "enabled": false,
      "keyFile": "./certs/local.key",
      "certFile": "./certs/local.crt"
    }
  }
}
```

URL local:

```txt
http://localhost:3000
```

---

## Configuración HTTPS

Para arrancar en HTTPS:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "protocol": "https",
    "https": {
      "enabled": true,
      "keyFile": "./certs/local.key",
      "certFile": "./certs/local.crt"
    }
  }
}
```

URL local:

```txt
https://localhost:3000
```

---

## Certificados locales

Los certificados locales deben generarse dentro de:

```txt
apps/sandbox-api/certs/
```

Archivos esperados:

```txt
local.key
local.crt
```

Para generar un certificado autofirmado local, ejecutar desde la raíz del proyecto:

```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout apps/sandbox-api/certs/local.key \
  -out apps/sandbox-api/certs/local.crt \
  -days 365 \
  -subj "/C=MX/ST=CDMX/L=CDMX/O=CLAIN Mexico/OU=JARVIS Sandbox API/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

---

## Archivos seguros en certs

La carpeta de certificados puede mantenerse versionada con archivos seguros:

```txt
apps/sandbox-api/certs/.gitkeep
apps/sandbox-api/certs/README.md
```

No deben publicarse:

```txt
*.key
*.crt
*.pem
*.p12
*.pfx
```

Cada desarrollador debe generar sus propios certificados locales.

---

## Pruebas con REST Client

El archivo de pruebas se encuentra en:

```txt
apps/sandbox-api/http/sandbox-api.http
```

Ejemplo:

```http
@protocol = https
@baseUrl = {{protocol}}://localhost:3000

### Sandbox-API | Root
GET {{baseUrl}}/

### Sandbox-API | Health
GET {{baseUrl}}/health

### Sandbox-API | Runtime Info
GET {{baseUrl}}/info

### Sandbox-API | Runtime Modules
GET {{baseUrl}}/modules
```

Para probar HTTP, cambiar:

```http
@protocol = http
```

Para probar HTTPS, cambiar:

```http
@protocol = https
```

---

## Rutas disponibles

```txt
GET /
GET /health
GET /info
GET /modules
```

---

## Flujo de arranque

```txt
settings.json
↓
@jarvis/bootstrap
↓
@jarvis/core
↓
core.info().server
↓
resolveSandboxHttpOptions()
↓
createSandboxHttpServer()
↓
Fastify HTTP/HTTPS
```

---

## Apagado seguro

**`Sandbox-API`** mantiene el apagado seguro del servidor y del runtime.

Orden de apagado:

```txt
Cerrar servidor HTTP/HTTPS
↓
Ejecutar core.shutdown()
↓
Apagar módulos vivos del runtime
```

---

## Notas

Cuando se usa certificado autofirmado, navegadores y herramientas HTTP pueden mostrar advertencias de confianza.

Esto es normal en certificados locales porque no están firmados por una autoridad certificadora pública.

Esta configuración es únicamente para desarrollo local o pruebas controladas.
