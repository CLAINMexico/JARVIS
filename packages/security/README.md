## Introducción

**`@jarvis/security`** es el paquete base de seguridad del ecosistema **`J.A.R.V.I.S.`**.

Este paquete incorpora soporte inicial para **JWT** mediante un servicio dedicado para firmar y verificar tokens dentro del runtime.


---

## Objetivo

El objetivo de **`@jarvis/security`** es centralizar capacidades de seguridad reutilizables dentro del ecosistema **`J.A.R.V.I.S.`**.

En palabras simples:

```txt
@jarvis/security es el guardia base de J.A.R.V.I.S.
```

Actualmente, este paquete permite:

- Firmar tokens JWT.
- Verificar tokens JWT.
- Validar tokens inválidos o expirados.
- Validar tokens ausentes.
- Definir tipos de token: **`access`**, **`refresh`** y **`service`**.
- Definir un payload base controlado.
- Definir opciones de firma.
- Definir opciones de verificación.
- Normalizar el resultado de verificación.
- Resolver expiración por tipo de token.
- Usar errores controlados mediante **`@jarvis/http`**.
- Trabajar con **`jose`** como librería JWT moderna compatible con TypeScript y ESM.

---

## Funcionamiento

**`@jarvis/security`** expone el servicio **`SecurityJwtService`**, encargado de firmar y verificar tokens JWT.

El servicio recibe una configuración base:

```ts
const jwt = new SecurityJwtService({
  secret: 'JARVIS_LOCAL_SECURITY_SECRET',
  issuer: 'J.A.R.V.I.S.',
  audience: 'Sandbox-API',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  serviceTokenExpiresIn: '1h'
});
```

En integraciones oficiales de **`J.A.R.V.I.S.`**:

```txt
issuer   = J.A.R.V.I.S.
audience = app.name
```

Por esta razón, **`issuer`** y **`audience`** no deben exponerse como valores configurables dentro de **`settings.json`**.

---

## Tipos de token

**`@jarvis/security`** soporta tres tipos de token:

```ts
export type SecurityJwtTokenType = 'access' | 'refresh' | 'service';
```

### access

Token de acceso para consumir rutas protegidas.

```ts
const accessToken = await jwt.sign({
  subject: 'user-001',
  tokenType: 'access',
  sessionId: 'session-001',
  roles: [
    'admin'
  ],
  permissions: [
    'users.read'
  ]
});
```

### refresh

Token usado para renovar sesión o generar nuevos access tokens.

```ts
const refreshToken = await jwt.sign({
  subject: 'user-001',
  tokenType: 'refresh',
  sessionId: 'session-001'
});
```

### service

Token usado para comunicación interna entre servicios.

```ts
const serviceToken = await jwt.sign({
  subject: 'service-sandbox-api',
  tokenType: 'service',
  permissions: [
    'internal.read'
  ]
});
```

---

## Payload base

El payload base se define con **`SecurityJwtPayload`**:

```ts
export interface SecurityJwtPayload {
  subject: string;
  tokenType: SecurityJwtTokenType;
  sessionId?: string;
  tenantId?: string;
  roles?: string[];
  permissions?: string[];
  metadata?: SecurityJwtMetadata;
}
```

El campo **`subject`** representa al dueño del token.

El campo **`tokenType`** es obligatorio y define el tipo de token emitido.

El campo **`metadata`** permite extender información segura sin abrir propiedades arbitrarias en la raíz del payload.

No se deben incluir dentro del payload JWT:

- Contraseñas.
- Hashes de contraseña.
- Tokens externos.
- Secretos de API.
- Llaves privadas.
- Refresh tokens externos.
- Información sensible innecesaria.

---

## Configuración JWT

En **`settings.json`** solo debe configurarse la parte necesaria para la aplicación:

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

Reglas oficiales:

```txt
issuer no va en settings.json.
audience no va en settings.json.
issuer se resuelve como J.A.R.V.I.S.
audience se resuelve desde app.name.
```

---

## Firma de tokens

Para firmar un token:

```ts
const token = await jwt.sign({
  subject: 'user-001',
  tokenType: 'access',
  sessionId: 'session-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.jwt.test'
  ]
});
```

También se puede sobrescribir la expiración para una firma concreta:

```ts
const token = await jwt.sign(
  {
    subject: 'user-001',
    tokenType: 'access'
  },
  {
    expiresIn: '30m'
  }
);
```

---

## Expiración por tipo de token

Cuando no se especifica **`expiresIn`** en la firma, **`@jarvis/security`** selecciona la expiración usando **`payload.tokenType`**:

```txt
access  -> accessTokenExpiresIn
refresh -> refreshTokenExpiresIn
service -> serviceTokenExpiresIn
```

Defaults:

```txt
access  -> 15m
refresh -> 7d
service -> 1h
```

---

## Verificación de tokens

Para verificar un token:

```ts
const result = await jwt.verify(token);
```

Resultado esperado:

```json
{
  "payload": {
    "subject": "user-001",
    "tokenType": "access",
    "sessionId": "session-001",
    "roles": [
      "admin"
    ],
    "permissions": [
      "security.jwt.test"
    ],
    "sub": "user-001",
    "iat": 1783203646,
    "exp": 1783204546,
    "iss": "J.A.R.V.I.S.",
    "aud": "Sandbox-API"
  },
  "issuedAt": 1783203646,
  "expiresAt": 1783204546,
  "issuer": "J.A.R.V.I.S.",
  "audience": "Sandbox-API"
}
```

---

## Errores controlados

**`@jarvis/security`** lanza errores controlados usando **`@jarvis/http`**.

Casos cubiertos:

```txt
security.jwt.invalid
security.jwt.missing
security.jwt.subject.missing
security.jwt.tokenType.invalid
```

---

## Integración HTTP

**`@jarvis/security`** no crea servidores ni registra rutas por sí mismo. Su responsabilidad es exponer servicios reutilizables para que una aplicación pueda integrarlos.

Una aplicación puede exponer rutas HTTP usando **`SecurityJwtService`**.

Ejemplo de rutas de prueba:

```txt
POST /security/jwt/sign
POST /security/jwt/verify
```

### Firmar un token desde HTTP

Body de ejemplo:

```json
{
  "subject": "user-001",
  "tokenType": "access",
  "sessionId": "session-001",
  "roles": [
    "admin"
  ],
  "permissions": [
    "security.jwt.test"
  ],
  "metadata": {
    "source": "sandbox-api.http"
  }
}
```

Respuesta esperada usando **`@jarvis/http`**:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token JWT generado correctamente.",
  "data": {
    "token": "..."
  }
}
```

### Verificar un token desde HTTP

Body de ejemplo:

```json
{
  "token": "..."
}
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token JWT verificado correctamente.",
  "data": {
    "payload": {
      "subject": "user-001",
      "tokenType": "access"
    }
  }
}
```

### Configuración recomendada

La configuración JWT puede vivir dentro de:

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

Reglas recomendadas para integraciones oficiales:

```txt
issuer   = J.A.R.V.I.S.
audience = app.name
```

Por esta razón, **`issuer`** y **`audience`** no necesitan exponerse dentro de **`settings.json`**.

---

## Uso

Ejemplo básico:

```ts
import {
  SecurityJwtService
} from '@jarvis/security';

const jwt = new SecurityJwtService({
  secret: 'JARVIS_LOCAL_SECURITY_SECRET',
  issuer: 'J.A.R.V.I.S.',
  audience: 'Sandbox-API',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  serviceTokenExpiresIn: '1h'
});

const token = await jwt.sign({
  subject: 'user-001',
  tokenType: 'access',
  sessionId: 'session-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.jwt.test'
  ]
});

const result = await jwt.verify(token);
```

Ejemplo de imports públicos:

```ts
import {
  SecurityJwtService,
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from '@jarvis/security';

import type {
  SecurityJwtMetadata,
  SecurityJwtOptions,
  SecurityJwtPayload,
  SecurityJwtSignOptions,
  SecurityJwtTokenType,
  SecurityJwtVerifyResult
} from '@jarvis/security';
```

---

## Notas

**`@jarvis/security`** no debe guardar secretos directamente en código productivo.

El valor **`secret`** debe venir desde una fuente segura, por ejemplo:

```txt
settings.json con placeholders
.env
variables de entorno
secret manager
```

Capacidades fuera del alcance actual:

- Middleware HTTP de autenticación.
- Login.
- Hash de contraseñas.
- Refresh tokens funcionales.
- Sesiones.
- Roles formales.
- Permisos formales.
- Policies.
- Guards.
- OAuth 2.0.
