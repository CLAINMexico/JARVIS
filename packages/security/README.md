## Introducción

**`@jarvis/security`** es el paquete base de seguridad del ecosistema **`J.A.R.V.I.S.`**.

Su propósito es concentrar las capacidades relacionadas con autenticación, autorización, tokens, sesiones, validación de acceso y utilidades de seguridad reutilizables por cualquier aplicación construida sobre el runtime.

---

## Objetivo

El objetivo de **`@jarvis/security`** es centralizar la seguridad del ecosistema **`J.A.R.V.I.S.`** en un paquete reutilizable, desacoplado de frameworks HTTP específicos y preparado para integrarse con distintas aplicaciones.

Este paquete debe poder usarse desde aplicaciones basadas en:

```txt
Fastify
Express
Nest
Hono
Koa
Workers
CLI
microservicios internos
```

La regla principal es:

```txt
@jarvis/security no depende del framework.
La aplicación adapta su framework a @jarvis/security.
```

Por esta razón, el paquete trabaja con contratos y datos genéricos, no con tipos propios de Fastify, Express, Nest u otro servidor.

---

## Alcance general

**`@jarvis/security`** está diseñado para cubrir las siguientes áreas:

```txt
Autenticación
Tokens JWT
Bearer Auth
Hash de contraseñas
Login
Refresh tokens
Sesiones
Roles
Permisos
Policies
Guards
OAuth 2.0
Tokens de servicio
Validaciones de acceso
Errores HTTP controlados
```

### JWT

JWT representa la base inicial de autenticación por tokens dentro de **`@jarvis/security`**.

El paquete puede:

- Firmar tokens.
- Verificar tokens.
- Validar expiración.
- Validar issuer.
- Validar audience.
- Validar subject.
- Validar tokenType.
- Devolver payload normalizado.
- Lanzar errores HTTP controlados cuando el token no es válido.

Los tokens soportados actualmente son:

```txt
access
refresh
service
```

---

### Bearer Auth

Bearer Auth representa la autenticación mediante el header HTTP:

```txt
Authorization: Bearer <token>
```

La lógica de Bearer Auth debe vivir dentro de **`@jarvis/security`** de forma universal y sin depender de un framework específico.

El paquete debe encargarse de:

- Validar que exista el header Authorization.
- Validar que tenga formato Bearer.
- Extraer el token.
- Verificar el JWT.
- Validar que el tipo de token esté permitido para la operación.
- Devolver un resultado autenticado normalizado.

La aplicación será responsable de adaptar esta lógica a su framework.

Ejemplo conceptual:

```ts
const auth = await securityAuth.authenticateBearer({
  authorizationHeader,
  allowedTokenTypes: [
    'access'
  ]
});
```

---

### Login

El login será la capa encargada de validar credenciales y emitir tokens iniciales.

El alcance esperado incluye:

- Recibir credenciales.
- Validar identidad.
- Validar contraseña usando hash seguro.
- Emitir access token.
- Emitir refresh token cuando aplique.
- Registrar información de sesión.
- Devolver una respuesta autenticada normalizada.

El login no debe estar amarrado a una base de datos específica. La validación del usuario debe poder integrarse mediante servicios externos o implementaciones propias de cada aplicación.

---

### Hash de contraseñas

El hash de contraseñas será una capacidad propia de **`@jarvis/security`** para evitar almacenar contraseñas en texto plano.

El alcance esperado incluye:

- Generar hashes seguros.
- Verificar contraseñas contra hashes existentes.
- Definir parámetros seguros por defecto.
- Evitar exponer información sensible en errores.
- Permitir evolución futura de algoritmos.

Esta capacidad será usada por flujos de login, creación de usuarios y cambio de contraseña.

---

### Refresh tokens

Los refresh tokens permitirán renovar sesiones sin obligar al usuario a iniciar sesión constantemente.

El alcance esperado incluye:

- Emitir refresh tokens.
- Verificar refresh tokens.
- Renovar access tokens.
- Asociar refresh tokens a una sesión.
- Revocar refresh tokens.
- Detectar refresh tokens inválidos o expirados.
- Separar claramente access tokens de refresh tokens.

Un refresh token no debe usarse para consumir rutas protegidas de usuario directamente. Su propósito es renovar credenciales.

---

### Sesiones

La capa de sesiones permitirá controlar el ciclo de vida de autenticaciones activas.

El alcance esperado incluye:

- Crear sesiones.
- Consultar sesiones.
- Cerrar sesiones.
- Revocar sesiones.
- Relacionar tokens con sessionId.
- Invalidar tokens asociados a sesiones cerradas.
- Mantener trazabilidad de accesos.

Las sesiones pueden vivir en distintos almacenes según la aplicación: memoria, base de datos, Redis u otro mecanismo externo.

---

### Roles

Los roles representan agrupaciones de responsabilidades o perfiles de acceso.

Ejemplos:

```txt
admin
user
support
service
auditor
```

El alcance esperado incluye:

- Leer roles desde el payload.
- Validar roles requeridos.
- Permitir múltiples roles.
- Devolver errores controlados cuando el usuario no tenga el rol necesario.

Los roles son una capa de autorización más general que los permisos.

---

### Permisos

Los permisos representan acciones específicas que un sujeto puede ejecutar.

Ejemplos:

```txt
users.read
users.create
security.jwt.test
reports.export
internal.health
```

El alcance esperado incluye:

- Leer permisos desde el payload.
- Validar permisos requeridos.
- Permitir múltiples permisos.
- Soportar validaciones tipo `all` o `any`.
- Devolver errores controlados cuando falten permisos.

Los permisos permiten controles más finos que los roles.

---

### Policies

Las policies representan reglas de autorización más expresivas que pueden combinar condiciones.

Ejemplo conceptual:

```txt
El usuario puede editar un recurso si:
- tiene el permiso resource.update
- pertenece al mismo tenant
- el recurso no está bloqueado
```

El alcance esperado incluye:

- Definir reglas reutilizables.
- Ejecutar policies contra un contexto.
- Combinar roles, permisos, tenant, metadata y reglas de negocio.
- Devolver resultados autorizados o errores controlados.

Las policies permitirán controlar accesos complejos sin duplicar lógica en cada ruta.

---

### Guards

Los guards serán piezas reutilizables para proteger operaciones o rutas.

Un guard puede validar:

- Que exista autenticación.
- Que el token sea de tipo access.
- Que el usuario tenga ciertos roles.
- Que el usuario tenga ciertos permisos.
- Que una policy se cumpla.
- Que el token pertenezca al tenant esperado.

Los guards no deben depender directamente de un framework. La aplicación debe adaptarlos al servidor usado.

---

### OAuth 2.0

OAuth 2.0 será una capacidad futura para integraciones con proveedores externos de identidad.

El alcance esperado puede incluir:

- Autenticación con proveedores externos.
- Validación de tokens externos.
- Intercambio de códigos por tokens.
- Integración con usuarios internos.
- Normalización de perfiles externos.
- Manejo seguro de clientes, secretos y redirects.

OAuth 2.0 debe integrarse sin reemplazar la autenticación interna de J.A.R.V.I.S., sino como una opción adicional para aplicaciones que lo requieran.

---

### Tokens de servicio

Los tokens de servicio permiten comunicación interna entre aplicaciones, servicios o procesos automatizados.

El tokenType usado para este caso es:

```txt
service
```

Uso esperado:

```txt
servicio interno -> consume recurso interno
```

Ejemplo:

```ts
const serviceToken = await jwt.sign({
  subject: 'service-sandbox-api',
  tokenType: 'service',
  permissions: [
    'internal.read'
  ]
});
```

Los tokens de servicio deben tener reglas distintas a los tokens de usuario.

---

## Funcionamiento actual

**`@jarvis/security`** expone actualmente el servicio **`SecurityJwtService`**, encargado de firmar y verificar tokens JWT.

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

Ejemplos:

```txt
user-001
service-sandbox-api
client-001
```

El campo **`tokenType`** es obligatorio y define el tipo de token emitido.

El campo **`sessionId`** permite asociar el token con una sesión.

El campo **`tenantId`** permite asociar el token con una empresa, cliente o espacio lógico.

Los campos **`roles`** y **`permissions`** permiten transportar información de autorización.

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

El valor **`secret`** debe resolverse desde una fuente segura.

Ejemplo:

```env
SETTINGS_SECURITY_JWT_SECRET=JARVIS_LOCAL_SECURITY_SECRET
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

Casos JWT cubiertos:

```txt
security.jwt.invalid
security.jwt.missing
security.jwt.subject.missing
security.jwt.tokenType.invalid
```

Errores esperados:

```txt
401 UNAUTHORIZED -> token ausente, inválido o expirado
403 FORBIDDEN    -> token válido, pero no autorizado para la operación
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

El paquete debe mantenerse desacoplado de frameworks HTTP específicos.

No se deben importar tipos de servidores externos dentro del núcleo del paquete, como:

```txt
FastifyRequest
Express.Request
Nest guards
Hono context
```

La aplicación es responsable de adaptar su framework al contrato universal de **`@jarvis/security`**.
