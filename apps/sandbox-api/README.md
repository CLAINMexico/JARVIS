## Introducción

**`Sandbox-API`** es una aplicación interna de desarrollo usada para probar el funcionamiento de **`J.A.R.V.I.S.`** desde el contexto de una API backend.

Este sandbox no representa una aplicación final de negocio. Su objetivo es servir como laboratorio para validar el comportamiento de los paquetes que se integran al runtime.

---

## Objetivo

El objetivo de **`Sandbox-API`** es validar que **`J.A.R.V.I.S.`** pueda:

```txt
- arrancar correctamente
- montar módulos reales
- preparar configuración inicial
- registrar servicios
- ejecutar su ciclo de vida
- exponer rutas HTTP/HTTPS
- probar integraciones entre packages
```

También permite validar integraciones entre paquetes del ecosistema, por ejemplo:

```txt
@jarvis/bootstrap
@jarvis/core
@jarvis/config
@jarvis/logger
@jarvis/http
@jarvis/security
```

---

## Configuración

Para preparar la configuración local, se deben copiar los archivos de ejemplo:

```bash
cp apps/sandbox-api/settings.example.json apps/sandbox-api/settings.json
cp apps/sandbox-api/.env.example apps/sandbox-api/.env
```

El archivo **`settings.json`** contiene configuración no sensible de la aplicación.

El archivo **`.env`** debe contener valores sensibles o secretos locales.

---

## Ejecución

Para ejecutar **`Sandbox-API`** desde la raíz del monorepo:

```bash
docker compose exec jarvis-node pnpm dev
```

También puede ejecutarse filtrando directamente la aplicación:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api dev
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

Para validar solamente **`Sandbox-API`**:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api build
docker compose exec jarvis-node pnpm --filter @jarvis/sandbox-api typecheck
```

Si la validación finaliza correctamente, significa que **`Sandbox-API`** puede arrancar usando los paquetes actuales de **`J.A.R.V.I.S.`**.

---

## Configuración de packages

La configuración de paquetes instalables del ecosistema se declara bajo:

```json
{
  "packages": {}
}
```

Antes se usaba:

```json
{
  "modules": {}
}
```

El cambio evita confusión entre:

```txt
packages       = paquetes instalables del monorepo
runtimeModules = módulos vivos registrados en runtime
modules        = módulos reportados por core.modules()
```

Ejemplo:

```json
{
  "packages": {
    "logger": {
      "enabled": true,
      "level": "debug",
      "error": {
        "verbose": false
      },
      "transports": {
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
}
```

**`@jarvis/bootstrap`** lee la configuración del logger desde:

```txt
packages.logger
```

---

## Configuración HTTP/HTTPS

**`Sandbox-API`** puede arrancar usando **HTTP** o **HTTPS** según la configuración declarada en **`settings.json`**.

La configuración del servidor es leída por **`@jarvis/bootstrap`**, normalizada por **`@jarvis/core`** y consumida por **`Sandbox-API`** desde **`core.info().server`**.

---

### Configuración HTTP

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

### Configuración HTTPS

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

### Archivos seguros en certs

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

## Configuración de logger transports

**`Sandbox-API`** configura las salidas del logger desde **`settings.json`** usando la sección:

```txt
packages.logger.transports
```

Ejemplo:

```json
{
  "packages": {
    "logger": {
      "enabled": true,
      "level": "debug",
      "error": {
        "verbose": false
      },
      "transports": {
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
}
```

---

### Consola

Para habilitar o deshabilitar logs en consola:

```json
{
  "transports": {
    "console": {
      "enabled": true,
      "colors": true
    }
  }
}
```

Opciones:

```txt
enabled = controla si se imprimen logs en consola
colors  = controla si la consola usa colores
```

---

### Archivos

Para habilitar o deshabilitar logs en archivos:

```json
{
  "transports": {
    "file": {
      "enabled": true,
      "path": "./logs",
      "splitByLevel": true,
      "writeAll": true
    }
  }
}
```

Opciones:

```txt
enabled      = controla si se escriben archivos de log
path         = ruta base de logs
splitByLevel = crea archivos separados por nivel
writeAll     = escribe todos los logs también en all.log
```

---

### Defaults esperados

Si una opción no se define, se aplican defaults seguros:

```txt
console.enabled -> true
console.colors  -> true

file.enabled      -> false
file.path         -> ./logs
file.splitByLevel -> true
file.writeAll     -> true
```

---

### Logger error verbose

La configuración de logger permite controlar si los errores se imprimen completos o resumidos.

Ruta:

```txt
packages.logger.error.verbose
```

Ejemplo:

```json
{
  "packages": {
    "logger": {
      "error": {
        "verbose": false
      }
    }
  }
}
```

Con **`verbose: false`**, el log conserva información segura:

```json
{
  "error": {
    "name": "JarvisHttpError",
    "message": "Token JWT inválido o expirado.",
    "code": "UNAUTHORIZED"
  }
}
```

Con **`verbose: true`**, el log incluye **`stack`** para depuración local.

---

## Configuración JWT

La configuración JWT de **`Sandbox-API`** vive dentro de:

```txt
api.jwt
```

Ejemplo:

```json
{
  "api": {
    "jwt": {
      "enabled": true,
      "secret": "SETTINGS_SECURITY_JWT_SECRET",
      "accessTokenExpiresIn": "15m",
      "refreshTokenExpiresIn": "7d",
      "serviceTokenExpiresIn": "1h"
    }
  }
}
```

Reglas oficiales de integración con **`@jarvis/security`**:

```txt
issuer   = J.A.R.V.I.S.
audience = app.name
```

Por esta razón, **`issuer`** y **`audience`** no se configuran en **`settings.json`**.

En esta aplicación:

```txt
issuer   = J.A.R.V.I.S.
audience = Sandbox-API
```

**`Sandbox-API`** usa esta configuración para crear una instancia de **`SecurityJwtService`** y exponer rutas HTTP de prueba para firma y verificación de tokens JWT.

---

## Rutas disponibles

```txt
GET  /
GET  /health
GET  /info
GET  /modules
GET  /http/success
GET  /http/error
POST /security/jwt/sign
POST /security/jwt/verify
GET  /security/protected
GET  /security/me
GET  /security/authorization/role
GET  /security/authorization/permission
GET  /security/authorization/admin
GET  /security/policies/role
GET  /security/policies/permission
GET  /security/policies/admin
```

---

## Rutas base

### GET /

Valida que la API esté activa y muestra información base del runtime y las rutas disponibles.

---

### GET /health

Valida que el servidor HTTP/HTTPS esté vivo.

---

### GET /info

Devuelve la información general expuesta por **`core.info()`**.

Ejemplo:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Información del runtime consultada correctamente.",
  "data": {
    "app": {
      "name": "Sandbox-API",
      "description": "Ambiente de pruebas para aplicaciones de tipo API.",
      "version": "1.0.0",
      "environment": "local",
      "timeZone": "America/Mexico_City"
    }
  }
}
```

---

### GET /modules

Devuelve los módulos registrados dentro del runtime.

---

## Rutas HTTP homologadas

Las rutas base de **`Sandbox-API`** responden usando el formato estándar de **`@jarvis/http`**.

Formato de respuesta exitosa:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

Formato de respuesta de error:

```json
{
  "success": false,
  "statusCode": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "..."
  }
}
```

---

### GET /http/success

Ruta de prueba para validar respuestas exitosas usando **`@jarvis/http`**.

También registra un log con:

```txt
package: @jarvis/http
event: http.response.success
statusCode: 200
```

Salida esperada en consola o archivo:

```txt
[2026-07-04 14:10:24] [INFO] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [200] - Respuesta exitosa generada por @jarvis/http.
{
  "route": "/http/success",
  "method": "GET"
}
```

---

### GET /http/error

Ruta de prueba para validar errores controlados usando **`@jarvis/http`**.

También registra un log con:

```txt
package: @jarvis/http
event: http.response.error
statusCode: 401
```

Salida esperada en consola o archivo:

```txt
[2026-07-04 14:10:29] [WARN] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [401] - Token inválido o ausente.
{
  "route": "/http/error",
  "method": "GET",
  "code": "UNAUTHORIZED"
}
```

---

## Rutas JWT

**`Sandbox-API`** expone rutas de prueba para validar **`@jarvis/security`** desde HTTP:

```txt
POST /security/jwt/sign
POST /security/jwt/verify
```

---

### POST /security/jwt/sign

Firma un token JWT usando **`SecurityJwtService`**.

Ejemplo access token:

```http
POST {{host}}/security/jwt/sign
Content-Type: application/json

{
  "subject": "user-001",
  "tokenType": "access",
  "sessionId": "session-001",
  "roles": [
    "admin"
  ],
  "permissions": [
    "security.jwt.test",
    "security.auth.test"
  ],
  "metadata": {
    "source": "sandbox-api.http"
  }
}
```

Tipos de token usados en pruebas:

```txt
access
refresh
service
```

---

### POST /security/jwt/verify

Verifica un token JWT usando **`SecurityJwtService`**.

```http
POST {{host}}/security/jwt/verify
Content-Type: application/json

{
  "token": "..."
}
```

Errores controlados validados:

```txt
token inválido
token ausente
body inválido
payload sin tokenType
```

---

## Bearer Auth en Sandbox-API

**`Sandbox-API`** integra la autenticación Bearer universal de **`@jarvis/security`** mediante un adaptador específico para Fastify.

La lógica principal de autenticación vive en **`@jarvis/security`**. La aplicación solo adapta Fastify para leer el header **`Authorization`**, ejecutar el servicio universal y adjuntar el resultado al request.

---

### Rutas protegidas

Se agregan rutas de prueba para validar autenticación Bearer:

```txt
GET /security/protected
GET /security/me
```

Ambas rutas requieren:

```txt
Authorization: Bearer <access-token>
```

Actualmente aceptan solamente tokens con:

```txt
tokenType = access
```

---

### GET /security/protected

Valida que una solicitud autenticada pueda consumir una ruta protegida.

```http
GET {{host}}/security/protected
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Acceso autorizado correctamente.",
  "data": {
    "authorized": true
  }
}
```

---

### GET /security/me

Devuelve el payload autenticado adjuntado al request.

```http
GET {{host}}/security/me
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payload autenticado obtenido correctamente.",
  "data": {
    "payload": {
      "subject": "user-001",
      "tokenType": "access",
      "sessionId": "session-001"
    }
  }
}
```

---

### Adaptador Fastify

El adaptador vive dentro de:

```txt
apps/sandbox-api/src/security/sandbox-security-auth-pre-handler.ts
```

Su responsabilidad es:

```txt
- Leer request.headers.authorization.
- Ejecutar securityAuth.authenticateBearer().
- Validar que el token sea de tipo access.
- Adjuntar el resultado en request.auth.
- Registrar logs de éxito o fallo.
- Devolver respuestas de error usando @jarvis/http.
```

---

### Contexto autenticado

Para permitir el uso de **`request.auth`**, **`Sandbox-API`** extiende los tipos de Fastify en:

```txt
apps/sandbox-api/src/security/sandbox-security-auth-context.ts
```

Ejemplo:

```ts
declare module 'fastify' {
  interface FastifyRequest {
    auth?: SecurityAuthResult;
  }
}
```

Esta extensión pertenece a **`Sandbox-API`** porque es específica de Fastify. **`@jarvis/security`** se mantiene desacoplado del framework.

---

### Flujo de autenticación

```txt
Cliente
↓
GET /security/me
Authorization: Bearer <token>
↓
Fastify ejecuta el preHandler
↓
Sandbox-API entrega el header a @jarvis/security
↓
SecurityAuthService valida Bearer + JWT + tokenType
↓
Sandbox-API adjunta request.auth
↓
La ruta responde usando el payload autenticado
```

---

### Casos validados

```txt
access token válido              -> 200 OK
Authorization ausente            -> 401 UNAUTHORIZED
Authorization mal formado        -> 401 UNAUTHORIZED
Bearer sin token                 -> 401 UNAUTHORIZED
token inválido                   -> 401 UNAUTHORIZED
refresh token en ruta access     -> 403 FORBIDDEN
service token en ruta access     -> 403 FORBIDDEN
```

---

### Logs esperados

Cuando una solicitud se autentica correctamente:

```txt
security.auth.bearer.success
```

Cuando una solicitud falla:

```txt
security.auth.bearer.failed
```

---

## Authorization en Sandbox-API

**`Sandbox-API`** integra la autorización por roles y permisos de **`@jarvis/security`** mediante rutas protegidas de prueba.

Estas rutas primero ejecutan Bearer Auth y después validan Authorization sobre el payload autenticado.

Flujo:

```txt
Authorization: Bearer <token>
↓
SecurityAuthService valida el token
↓
request.auth recibe el payload autenticado
↓
SecurityAuthorizationService valida roles y permisos
↓
La ruta responde 200 o 403
```

---

### Rutas de autorización

Se agregan las siguientes rutas protegidas:

```txt
GET /security/authorization/role
GET /security/authorization/permission
GET /security/authorization/admin
```

Todas requieren:

```txt
Authorization: Bearer <access-token>
```

---

### GET /security/authorization/role

Valida que el payload autenticado tenga el rol:

```txt
admin
```

Request:

```http
GET {{host}}/security/authorization/role
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rol autorizado correctamente.",
  "data": {
    "authorized": true,
    "mode": "all",
    "requiredRoles": [
      "admin"
    ]
  }
}
```

---

### GET /security/authorization/permission

Valida que el payload autenticado tenga el permiso:

```txt
security.auth.test
```

Request:

```http
GET {{host}}/security/authorization/permission
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Permiso autorizado correctamente.",
  "data": {
    "authorized": true,
    "mode": "all",
    "requiredPermissions": [
      "security.auth.test"
    ]
  }
}
```

---

### GET /security/authorization/admin

Valida que el payload autenticado tenga:

```txt
role: admin
permission: security.auth.test
```

Request:

```http
GET {{host}}/security/authorization/admin
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rol y permiso autorizados correctamente.",
  "data": {
    "authorized": true,
    "mode": "all",
    "requiredRoles": [
      "admin"
    ],
    "requiredPermissions": [
      "security.auth.test"
    ]
  }
}
```

---

### Casos 403

Los casos prohibidos usan access tokens válidos, pero sin roles o permisos suficientes.

Esto permite validar que el error sea de autorización, no de autenticación.

Casos validados:

```txt
token sin roles        -> 403 FORBIDDEN
token sin permissions  -> 403 FORBIDDEN
token guest            -> 403 FORBIDDEN
```

Mensaje esperado:

```txt
Roles o permisos insuficientes para esta operación.
```

---

### Logs esperados

Casos exitosos:

```txt
security.authorization.role.success
security.authorization.permission.success
security.authorization.success
```

Casos fallidos:

```txt
security.authorization.role.failed
security.authorization.permission.failed
security.authorization.failed
security.authorization.forbidden
```

---

## Policies en Sandbox-API

**`Sandbox-API`** integra el Policy engine universal de **`@jarvis/security`** mediante rutas protegidas de prueba.

A diferencia de Authorization directo, donde la ruta define explícitamente los roles o permisos requeridos, en Policies la aplicación define una regla reutilizable y **`@jarvis/security`** evalúa si el payload autenticado cumple con esa regla.

La separación de responsabilidades es:

```txt
Sandbox-API
↓
define las policies concretas de prueba

@jarvis/security
↓
evalúa payload + policy
```

---

### Ubicación de policies

Las policies propias de **`Sandbox-API`** viven en:

```txt
apps/sandbox-api/src/security/policies/sandbox-security-policies.ts
```

Policies definidas:

```txt
SandboxAdminRolePolicy
SandboxSecurityPermissionPolicy
SandboxSecurityAdminPolicy
```

Estas policies pertenecen a **`Sandbox-API`**, no a **`@jarvis/security`**.

---

### SandboxAdminRolePolicy

Valida acceso por rol:

```txt
requiredRoles:
- admin
```

Nombre de policy:

```txt
sandbox.security.admin.role
```

Uso esperado:

```txt
GET /security/policies/role
```

---

### SandboxSecurityPermissionPolicy

Valida acceso por permiso:

```txt
requiredPermissions:
- security.auth.test
```

Nombre de policy:

```txt
sandbox.security.permission
```

Uso esperado:

```txt
GET /security/policies/permission
```

---

### SandboxSecurityAdminPolicy

Valida acceso combinando rol y permiso:

```txt
requiredRoles:
- admin

requiredPermissions:
- security.auth.test
```

Nombre de policy:

```txt
sandbox.security.admin
```

Uso esperado:

```txt
GET /security/policies/admin
```

---

### Rutas de Policies

Se agregan las siguientes rutas protegidas:

```txt
GET /security/policies/role
GET /security/policies/permission
GET /security/policies/admin
```

Todas requieren:

```txt
Authorization: Bearer <access-token>
```

Estas rutas primero ejecutan Bearer Auth y después evalúan una policy definida por **`Sandbox-API`**.

---

### GET /security/policies/role

Valida la policy **`SandboxAdminRolePolicy`**.

Request:

```http
GET {{host}}/security/policies/role
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Policy de rol autorizada correctamente.",
  "data": {
    "authorized": true,
    "policyName": "sandbox.security.admin.role",
    "mode": "all",
    "requiredRoles": [
      "admin"
    ]
  }
}
```

---

### GET /security/policies/permission

Valida la policy **`SandboxSecurityPermissionPolicy`**.

Request:

```http
GET {{host}}/security/policies/permission
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Policy de permiso autorizada correctamente.",
  "data": {
    "authorized": true,
    "policyName": "sandbox.security.permission",
    "mode": "all",
    "requiredPermissions": [
      "security.auth.test"
    ]
  }
}
```

---

### GET /security/policies/admin

Valida la policy **`SandboxSecurityAdminPolicy`**.

Request:

```http
GET {{host}}/security/policies/admin
Authorization: Bearer {{signAccessToken.response.body.data.token}}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Policy autorizada correctamente.",
  "data": {
    "authorized": true,
    "policyName": "sandbox.security.admin",
    "mode": "all",
    "requiredRoles": [
      "admin"
    ],
    "requiredPermissions": [
      "security.auth.test"
    ]
  }
}
```

---

### Casos 403 de Policies

Los casos prohibidos usan access tokens válidos, pero no cumplen la policy evaluada.

Casos validados:

```txt
token sin roles        -> 403 FORBIDDEN
token sin permissions  -> 403 FORBIDDEN
token guest            -> 403 FORBIDDEN
```

Mensaje esperado:

```txt
Policy no autorizada para esta operación.
```

Esto confirma que el error corresponde a autorización por policy y no a autenticación.

---

### Logs esperados de Policies

Casos exitosos:

```txt
security.policy.role.success
security.policy.permission.success
security.policy.success
```

Casos fallidos:

```txt
security.policy.role.failed
security.policy.permission.failed
security.policy.failed
security.policy.forbidden
```

---

### Flujo de Policies

```txt
Cliente
↓
GET /security/policies/admin
Authorization: Bearer <token>
↓
Fastify ejecuta Bearer Auth
↓
request.auth recibe el payload autenticado
↓
Sandbox-API selecciona una policy propia
↓
SecurityPolicyService evalúa payload + policy
↓
La ruta responde 200 o 403
```

---

### Regla de arquitectura

```txt
Sandbox-API define la policy.
@jarvis/security evalúa la policy.
```

Esto evita que **`@jarvis/security`** conozca reglas específicas de negocio y permite que cada aplicación defina su propio catálogo de policies.

---

## Pruebas con REST Client

El archivo de pruebas se encuentra en:

```txt
apps/sandbox-api/http/sandbox-api.http
```

El archivo contiene bloques para validar:

```txt
- rutas base de Sandbox-API
- respuestas estándar de @jarvis/http
- firma y verificación JWT
- Bearer Auth
- Authorization por roles y permisos
- Policies
- casos de error controlado
```

Flujo recomendado:

```txt
1. Ejecutar App | Health.
2. Ejecutar JWT | Sign access token.
3. Ejecutar JWT | Sign refresh token.
4. Ejecutar JWT | Sign service token.
5. Ejecutar Bearer Auth | Protected route with access token.
6. Ejecutar Bearer Auth | Me with access token.
7. Ejecutar Authorization | Role admin allowed.
8. Ejecutar Authorization | Permission security.auth.test allowed.
9. Ejecutar Authorization | Admin role and permission allowed.
10. Ejecutar Policy | Role admin allowed.
11. Ejecutar Policy | Permission security.auth.test allowed.
12. Ejecutar Policy | Admin role and permission allowed.
13. Ejecutar JWT | Sign access token without roles.
14. Ejecutar JWT | Sign access token without permissions.
15. Ejecutar JWT | Sign access token guest.
16. Ejecutar los casos forbidden de Authorization.
17. Ejecutar los casos forbidden de Policies.
18. Ejecutar los casos de error JWT y Bearer Auth.
```

Para probar HTTP, ajustar el host:

```http
@host = http://localhost:3000
```

Para probar HTTPS, ajustar el host:

```http
@host = https://localhost:3000
```

---

## Integración con @jarvis/logger

**`Sandbox-API`** usa **`@jarvis/logger`** como sistema principal de bitácoras.

El formato homologado esperado es:

```txt
[YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] | [STATUSCODE] - MESSAGE
```

Ejemplo:

```txt
[2026-07-04 14:10:24] [INFO] [@jarvis/http] [J.A.R.V.I.S. | Sandbox-API] | [200] - Respuesta exitosa generada por @jarvis/http.
```

Cuando no existe **`statusCode`**, el bloque se omite:

```txt
[2026-07-04 14:10:18] [INFO] [Sandbox-API] [J.A.R.V.I.S. | Sandbox-API] - Servidor HTTPS: https://localhost:3000
```

---

### Archivos de log

Cuando la salida a archivos está habilitada, se genera la estructura:

```txt
logs/YYYY/MM/DD/
```

Archivos esperados:

```txt
all.log
debug.log
info.log
warn.log
error.log
fatal.log
```

Ejemplo:

```txt
logs/
  2026/
    07/
      04/
        all.log
        debug.log
        info.log
        warn.log
        error.log
        fatal.log
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
registerSandboxHttpRoutes()
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

También es importante considerar:

```txt
- No publicar certificados locales reales.
- No subir archivos .env.
- No subir archivos logs/ ni *.log.
- Mantener las rutas de prueba como laboratorio controlado del ecosistema.
- Mantener documentación en español.
- Mantener comentarios útiles en español.
```
