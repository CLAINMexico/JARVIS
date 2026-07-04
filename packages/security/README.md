## Introducción

**`@jarvis/security`** es el paquete base de seguridad del ecosistema **`J.A.R.V.I.S.`**.

En su primera versión, este paquete incorpora soporte inicial para **JWT** mediante un servicio dedicado para firmar y verificar tokens dentro del runtime.

Esta versión no implementa todavía login, refresh tokens, sesiones, roles formales, permisos formales, policies, guards ni OAuth 2.0. Esos bloques se integrarán en versiones posteriores de forma controlada.

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
- Definir un payload base para JWT.
- Definir opciones de firma.
- Definir opciones de verificación.
- Normalizar el resultado de verificación.
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
  accessTokenExpiresIn: '15m'
});
```

Con esa configuración puede generar tokens:

```ts
const token = await jwt.sign({
  subject: 'user-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.jwt.test'
  ],
  name: 'Usuario de prueba'
});
```

Y verificarlos:

```ts
const result = await jwt.verify(token);
```

### Payload base

El payload base se define con **`SecurityJwtPayload`**:

```ts
export interface SecurityJwtPayload {
  subject: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
}
```

El campo **`subject`** representa al dueño del token.

Ejemplos:

```txt
user-001
service-sandbox-api
client-001
```

Los campos **`roles`** y **`permissions`** viajan como metadata en esta versión. La validación formal de roles y permisos se implementará en versiones posteriores.

### Opciones JWT

El contrato **`SecurityJwtOptions`** permite configurar:

```txt
secret
issuer
audience
accessTokenExpiresIn
```

Ejemplo:

```ts
const jwt = new SecurityJwtService({
  secret: 'JARVIS_LOCAL_SECURITY_SECRET',
  issuer: 'J.A.R.V.I.S.',
  audience: 'Sandbox-API',
  accessTokenExpiresIn: '15m'
});
```

### Firma de tokens

Para firmar un token:

```ts
const token = await jwt.sign({
  subject: 'user-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.jwt.test'
  ]
});
```

También se pueden sobrescribir opciones específicas de firma:

```ts
const token = await jwt.sign(
  {
    subject: 'user-001'
  },
  {
    issuer: 'J.A.R.V.I.S.',
    audience: 'Sandbox-API',
    expiresIn: '30m'
  }
);
```

### Verificación de tokens

Para verificar un token:

```ts
const result = await jwt.verify(token);
```

Resultado esperado:

```json
{
  "payload": {
    "subject": "user-001",
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

### Errores controlados

Cuando un token es inválido, expiró o no coincide con la configuración esperada, **`@jarvis/security`** lanza un error controlado usando **`@jarvis/http`**.

Ejemplo de error por token inválido:

```txt
Token JWT inválido o expirado.
```

Metadata esperada:

```txt
package: @jarvis/security
event: security.jwt.invalid
```

Ejemplo de error por token ausente:

```txt
Token JWT ausente.
```

Metadata esperada:

```txt
package: @jarvis/security
event: security.jwt.missing
```

### Secret JWT

El secreto JWT se transforma internamente a **`Uint8Array`** mediante:

```ts
encodeSecurityJwtSecret(secret)
```

También se valida que no esté vacío mediante:

```ts
assertSecurityJwtSecret(secret)
```

Si el secreto está vacío, se lanza un error para evitar firmar o verificar tokens con una configuración insegura.

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
  accessTokenExpiresIn: '15m'
});

const token = await jwt.sign({
  subject: 'user-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.jwt.test'
  ],
  name: 'Usuario de prueba'
});

const result = await jwt.verify(token);
```

Ejemplo con token inválido:

```ts
try {
  await jwt.verify('token-invalido');
} catch (error: unknown) {
  console.error(error);
}
```

Ejemplo con token ausente:

```ts
try {
  await jwt.verify('');
} catch (error: unknown) {
  console.error(error);
}
```

Ejemplo de imports públicos:

```ts
import {
  SecurityJwtService,
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret
} from '@jarvis/security';

import type {
  SecurityJwtOptions,
  SecurityJwtPayload,
  SecurityJwtSignOptions,
  SecurityJwtVerifyResult
} from '@jarvis/security';
```

---

## Notas

**`@jarvis/security`** no debe guardar secretos directamente en código productivo.

El valor **`secret`** debe venir desde una fuente segura, por ejemplo:

```txt
settings.json
.env
variables de entorno
secret manager
```

No se deben incluir dentro del payload JWT:

- Contraseñas.
- Tokens externos.
- Secretos de API.
- Llaves privadas.
- Información sensible innecesaria.
- Datos personales que no sean necesarios para autenticación/autorización.

Esta versión solo implementa JWT inicial.

Queda pendiente para versiones posteriores:

- Integración con **`Sandbox-API`**.
- Middleware HTTP de autenticación.
- Login.
- Hash de contraseñas.
- Refresh tokens.
- Sesiones.
- Roles formales.
- Permisos formales.
- Policies.
- Guards.
- OAuth 2.0.

También es importante considerar:

- Mantener documentación en español.
- Mantener comentarios útiles en español.
- Mantener commits en español.
- No subir secretos reales al repositorio.
- No imprimir tokens reales en logs productivos.
