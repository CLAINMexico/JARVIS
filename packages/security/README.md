## Introducción

**`@jarvis/security`** es el paquete base de seguridad del ecosistema **`J.A.R.V.I.S.`**.

Su propósito es concentrar capacidades relacionadas con autenticación, autorización, tokens, validación de acceso y utilidades de seguridad reutilizables por cualquier aplicación construida sobre el runtime.

El paquete está diseñado para crecer de forma progresiva sin acoplarse a frameworks HTTP específicos ni a una fuente de datos concreta.

---

## Objetivo

El objetivo de **`@jarvis/security`** es centralizar la seguridad del ecosistema **`J.A.R.V.I.S.`** en un paquete reutilizable, desacoplado y preparado para integrarse con distintas aplicaciones.

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
Authorization
Roles
Permisos
Policy engine universal
Hash de contraseñas
Login
Refresh tokens
Sesiones
Policies avanzadas
Guards
OAuth 2.0
Tokens de servicio
Validaciones de acceso
Errores HTTP controlados
```

---

## Arquitectura

**`@jarvis/security`** no debe consultar directamente bases de datos ni depender de frameworks HTTP.

La responsabilidad del paquete es evaluar datos de seguridad ya normalizados.

```txt
@jarvis/security
↓
valida tokens, autenticación, roles, permisos y policies

Aplicación / Adapter / Provider
↓
obtiene datos desde HTTP, BD, Redis, OAuth u otra fuente
```

Regla:

```txt
@jarvis/security no consulta datos.
@jarvis/security evalúa datos.
```

Esto permite que en futuras versiones una aplicación pueda integrar **`@jarvis/database`** o un provider externo sin reescribir la lógica central de seguridad.

---

## Capacidades actuales

Actualmente **`@jarvis/security`** incluye:

```txt
JWT
Bearer Auth
Authorization por roles y permisos
Policy engine universal
```

---

## JWT

JWT representa la base inicial de autenticación por tokens dentro de **`@jarvis/security`**.

El paquete puede:

```txt
- Firmar tokens.
- Verificar tokens.
- Validar expiración.
- Validar issuer.
- Validar audience.
- Validar subject.
- Validar tokenType.
- Devolver payload normalizado.
- Lanzar errores HTTP controlados cuando el token no es válido.
```

Los tokens soportados actualmente son:

```txt
access
refresh
service
```

---

## SecurityJwtService

El servicio principal para JWT es:

```txt
SecurityJwtService
```

Ejemplo de configuración:

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

---

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

---

### refresh

Token usado para renovar sesión o generar nuevos access tokens.

```ts
const refreshToken = await jwt.sign({
  subject: 'user-001',
  tokenType: 'refresh',
  sessionId: 'session-001'
});
```

Un refresh token no debe usarse para consumir rutas protegidas de usuario directamente. Su propósito es renovar credenciales.

---

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

Los tokens de servicio deben tener reglas distintas a los tokens de usuario.

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

```txt
Contraseñas
Hashes de contraseña
Tokens externos
Secretos de API
Llaves privadas
Refresh tokens externos
Información sensible innecesaria
```

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

## Bearer Auth universal

**`@jarvis/security`** expone una capa universal para autenticar solicitudes usando el header HTTP **`Authorization`** con esquema **`Bearer`**.

Ejemplo:

```txt
Authorization: Bearer <token>
```

Esta capacidad permite validar tokens JWT desde cualquier aplicación sin acoplar el paquete a un framework específico.

La regla de arquitectura es:

```txt
@jarvis/security valida la autenticación.
La aplicación adapta su framework a @jarvis/security.
```

---

## SecurityAuthService

El servicio **`SecurityAuthService`** concentra la lógica universal de autenticación Bearer.

Ejemplo de uso:

```ts
import {
  SecurityAuthService,
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

const securityAuth = new SecurityAuthService({
  jwt
});
```

Para autenticar una solicitud:

```ts
const auth = await securityAuth.authenticateBearer({
  authorizationHeader,
  allowedTokenTypes: [
    'access'
  ]
});
```

---

## SecurityAuthBearerOptions

Las opciones de autenticación Bearer se definen mediante **`SecurityAuthBearerOptions`**.

```ts
export interface SecurityAuthBearerOptions {
  authorizationHeader: string | null | undefined;
  allowedTokenTypes?: SecurityJwtTokenType[];
}
```

Propiedades:

```txt
authorizationHeader = valor recibido desde el header Authorization
allowedTokenTypes   = tipos de token permitidos para la operación actual
```

Se permite **`undefined`** porque algunos frameworks devuelven ese valor cuando el header no existe.

---

## SecurityAuthResult

Cuando la autenticación es correcta, **`authenticateBearer()`** devuelve un resultado normalizado:

```ts
export interface SecurityAuthResult {
  token: string;
  payload: SecurityJwtPayload;
}
```

Ejemplo:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "payload": {
    "subject": "user-001",
    "tokenType": "access",
    "sessionId": "session-001",
    "roles": [
      "admin"
    ],
    "permissions": [
      "security.auth.test"
    ]
  }
}
```

---

## allowedTokenTypes

La propiedad **`allowedTokenTypes`** permite restringir qué tipo de token puede usarse en una operación.

Ejemplo para rutas protegidas de usuario:

```ts
const auth = await securityAuth.authenticateBearer({
  authorizationHeader,
  allowedTokenTypes: [
    'access'
  ]
});
```

Regla recomendada:

```txt
access  = consumir rutas protegidas de usuario
refresh = renovar credenciales
service = comunicación interna entre servicios
```

---

## extractSecurityBearerToken

La utilidad **`extractSecurityBearerToken()`** extrae y valida el token desde un header Authorization.

```ts
import {
  extractSecurityBearerToken
} from '@jarvis/security';

const token = extractSecurityBearerToken(
  'Bearer eyJhbGciOiJIUzI1NiIs...'
);
```

Casos validados:

```txt
Authorization header ausente.
Authorization header vacío.
Authorization header con esquema incorrecto.
Authorization header Bearer sin token.
```

---

## Authorization roles y permissions

**`@jarvis/security`** incorpora una capa universal de autorización para validar roles y permisos sobre un payload previamente autenticado.

Esta funcionalidad complementa el flujo de seguridad existente:

```txt
JWT firma/verifica
↓
Bearer Auth autentica el token
↓
Authorization valida roles y permisos
```

La autorización no consulta base de datos y no depende de frameworks HTTP. Su responsabilidad es evaluar datos ya normalizados dentro del payload JWT.

---

## SecurityAuthorizationService

El servicio principal es:

```txt
SecurityAuthorizationService
```

Este servicio evalúa:

```txt
roles presentes en payload.roles
permissions presentes en payload.permissions
requiredRoles solicitados por la operación
requiredPermissions solicitados por la operación
mode: all | any
```

Si el payload cumple con los requisitos, devuelve un resultado normalizado.

Si no cumple, lanza un error controlado **`403 FORBIDDEN`** usando **`@jarvis/http`**.

---

## SecurityAuthorizationMode

```ts
export type SecurityAuthorizationMode = 'all' | 'any';
```

Modos disponibles:

```txt
all = todos los roles/permisos requeridos deben existir
any = al menos uno de los roles/permisos requeridos debe existir
```

---

## SecurityAuthorizationOptions

```ts
export interface SecurityAuthorizationOptions {
  payload: SecurityJwtPayload;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  mode?: SecurityAuthorizationMode;
}
```

Propiedades:

```txt
payload              = payload JWT previamente autenticado
requiredRoles       = roles requeridos para autorizar la operación
requiredPermissions = permisos requeridos para autorizar la operación
mode                = modo de evaluación, por defecto all
```

---

## SecurityAuthorizationResult

```ts
export interface SecurityAuthorizationResult {
  authorized: true;
  mode: SecurityAuthorizationMode;
  requiredRoles: string[];
  requiredPermissions: string[];
  payloadRoles: string[];
  payloadPermissions: string[];
}
```

Este resultado permite auditar qué se pidió y qué tenía el payload autenticado.

---

## Uso de Authorization

### Crear servicio

```ts
import {
  SecurityAuthorizationService
} from '@jarvis/security';

const authorization = new SecurityAuthorizationService();
```

---

### Validar rol requerido

```ts
authorization.requireRoles({
  payload,
  requiredRoles: [
    'admin'
  ],
  mode: 'all'
});
```

---

### Validar permiso requerido

```ts
authorization.requirePermissions({
  payload,
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
});
```

---

### Validar rol y permiso

```ts
authorization.authorize({
  payload,
  requiredRoles: [
    'admin'
  ],
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
});
```

---

## Utilidades de Authorization

### normalizeSecurityAuthorizationValues

Normaliza arreglos de roles o permisos.

```ts
normalizeSecurityAuthorizationValues([
  'admin',
  ' security.auth.test ',
  ''
]);
```

Resultado:

```ts
[
  'admin',
  'security.auth.test'
]
```

---

### matchSecurityAuthorizationValues

Evalúa si una lista origen cumple con una lista requerida.

```ts
matchSecurityAuthorizationValues(
  [
    'admin'
  ],
  [
    'admin'
  ],
  'all'
);
```

Resultado:

```ts
true
```

---

## Policy engine universal

**`@jarvis/security`** incorpora un motor universal para evaluar **policies** de seguridad.

Una policy es una regla declarativa definida por una aplicación y evaluada por **`@jarvis/security`** usando un payload previamente autenticado.

La regla de arquitectura es:

```txt
@jarvis/security = motor de evaluación
App              = define sus propias policies
```

Por esta razón, **`@jarvis/security`** no incluye policies concretas de negocio. El package únicamente define contratos, resultado normalizado y servicio de evaluación.

---

## SecurityPolicy

El contrato **`SecurityPolicy`** define el esqueleto de una policy que puede ser creada por cualquier aplicación.

```ts
export interface SecurityPolicy {
  name: string;
  description?: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  mode?: SecurityAuthorizationMode;
}
```

Propiedades:

```txt
name                = nombre único de la policy
description         = descripción opcional de la regla
requiredRoles       = roles requeridos por la policy
requiredPermissions = permisos requeridos por la policy
mode                = modo de evaluación all | any
```

Ejemplo de una policy definida por una aplicación:

```ts
import type {
  SecurityPolicy
} from '@jarvis/security';

export const SandboxSecurityAdminPolicy = {
  name: 'sandbox.security.admin',
  description: 'Permite validar acceso usando rol admin y permiso security.auth.test.',
  requiredRoles: [
    'admin'
  ],
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
} satisfies SecurityPolicy;
```

---

## SecurityPolicyOptions

Las opciones para evaluar una policy se definen mediante **`SecurityPolicyOptions`**.

```ts
export interface SecurityPolicyOptions {
  payload: SecurityJwtPayload;
  policy: SecurityPolicy;
}
```

Propiedades:

```txt
payload = payload JWT previamente autenticado
policy  = policy definida por la aplicación
```

---

## SecurityPolicyResult

Cuando la policy se cumple, **`SecurityPolicyService`** devuelve un resultado normalizado.

```ts
export interface SecurityPolicyResult {
  authorized: true;
  policyName: string;
  policyDescription?: string;
  mode: SecurityAuthorizationMode;
  requiredRoles: string[];
  requiredPermissions: string[];
  payloadRoles: string[];
  payloadPermissions: string[];
}
```

Este resultado permite auditar:

```txt
- qué policy se evaluó
- qué roles pidió
- qué permisos pidió
- qué roles tenía el payload
- qué permisos tenía el payload
```

---

## SecurityPolicyService

El servicio **`SecurityPolicyService`** evalúa una policy contra un payload autenticado.

```ts
import {
  SecurityPolicyService
} from '@jarvis/security';

const policy = new SecurityPolicyService();
```

Uso:

```ts
const result = policy.evaluate({
  payload: request.auth.payload,
  policy: SandboxSecurityAdminPolicy
});
```

Respuesta esperada:

```json
{
  "authorized": true,
  "policyName": "sandbox.security.admin",
  "policyDescription": "Permite validar acceso usando rol admin y permiso security.auth.test.",
  "mode": "all",
  "requiredRoles": [
    "admin"
  ],
  "requiredPermissions": [
    "security.auth.test"
  ],
  "payloadRoles": [
    "admin"
  ],
  "payloadPermissions": [
    "security.auth.test"
  ]
}
```

---

## Relación con Authorization

El Policy engine no reemplaza a **`SecurityAuthorizationService`**.

La relación entre ambos es:

```txt
SecurityAuthorizationService = valida roles/permisos directos
SecurityPolicyService        = evalúa una regla declarativa que contiene roles/permisos
```

Internamente, **`SecurityPolicyService`** usa la autorización existente para evaluar los roles y permisos declarados por la policy.

Flujo:

```txt
payload + policy
↓
SecurityPolicyService
↓
SecurityAuthorizationService
↓
authorized o 403 FORBIDDEN
```

---

## Error controlado de Policies

Cuando el payload autenticado no cumple con la policy, se lanza:

```txt
403 FORBIDDEN - Policy no autorizada para esta operación.
```

Evento principal:

```txt
security.policy.forbidden
```

Este error significa que:

```txt
- el token puede ser válido
- el usuario puede estar autenticado
- pero no cumple la policy solicitada
```

---

## Ejemplo completo de Policy engine

```ts
import {
  SecurityAuthService,
  SecurityJwtService,
  SecurityPolicyService
} from '@jarvis/security';

import type {
  SecurityPolicy
} from '@jarvis/security';

const jwt = new SecurityJwtService({
  secret: 'JARVIS_LOCAL_SECURITY_SECRET',
  issuer: 'J.A.R.V.I.S.',
  audience: 'Sandbox-API',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  serviceTokenExpiresIn: '1h'
});

const auth = new SecurityAuthService({
  jwt
});

const policy = new SecurityPolicyService();

const SandboxSecurityAdminPolicy = {
  name: 'sandbox.security.admin',
  requiredRoles: [
    'admin'
  ],
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
} satisfies SecurityPolicy;

const authenticated = await auth.authenticateBearer({
  authorizationHeader,
  allowedTokenTypes: [
    'access'
  ]
});

const result = policy.evaluate({
  payload: authenticated.payload,
  policy: SandboxSecurityAdminPolicy
});
```

---

## Regla de responsabilidad

```txt
La app define qué significa poder hacer algo.
@jarvis/security evalúa si el payload cumple la regla.
```

Ejemplo:

```txt
Sandbox-API define:
sandbox.security.admin

@jarvis/security evalúa:
roles requeridos
permisos requeridos
mode
payload.roles
payload.permissions
```

Esto permite que cada aplicación tenga su propio catálogo de policies sin modificar el núcleo de seguridad.

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

Casos Bearer Auth cubiertos:

```txt
security.auth.authorization.missing
security.auth.authorization.invalid
security.auth.token.missing
security.auth.tokenType.forbidden
```

Casos Authorization cubiertos:

```txt
security.authorization.forbidden
```

Casos Policies cubiertos:

```txt
security.policy.forbidden
```

Errores esperados:

```txt
401 UNAUTHORIZED -> token ausente, inválido o expirado
403 FORBIDDEN    -> token válido, pero no autorizado para la operación
```

---

## Integración HTTP

**`@jarvis/security`** no crea servidores ni registra rutas por sí mismo.

Una aplicación puede exponer rutas HTTP usando los servicios de seguridad.

Ejemplo de rutas de prueba:

```txt
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

## Ejemplo conceptual con Fastify

```ts
const auth = await securityAuth.authenticateBearer({
  authorizationHeader: request.headers.authorization,
  allowedTokenTypes: [
    'access'
  ]
});

request.auth = auth;

policy.evaluate({
  payload: request.auth.payload,
  policy: SandboxSecurityAdminPolicy
});
```

La aplicación decide cómo adjuntar el resultado autenticado a su request, contexto o flujo interno.

---

## Uso básico

```ts
import {
  SecurityAuthorizationService,
  SecurityAuthService,
  SecurityJwtService,
  SecurityPolicyService
} from '@jarvis/security';

const jwt = new SecurityJwtService({
  secret: 'JARVIS_LOCAL_SECURITY_SECRET',
  issuer: 'J.A.R.V.I.S.',
  audience: 'Sandbox-API',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  serviceTokenExpiresIn: '1h'
});

const auth = new SecurityAuthService({
  jwt
});

const authorization = new SecurityAuthorizationService();
const policy = new SecurityPolicyService();

const token = await jwt.sign({
  subject: 'user-001',
  tokenType: 'access',
  sessionId: 'session-001',
  roles: [
    'admin'
  ],
  permissions: [
    'security.auth.test'
  ]
});

const authenticated = await auth.authenticateBearer({
  authorizationHeader: `Bearer ${token}`,
  allowedTokenTypes: [
    'access'
  ]
});

authorization.authorize({
  payload: authenticated.payload,
  requiredRoles: [
    'admin'
  ],
  requiredPermissions: [
    'security.auth.test'
  ],
  mode: 'all'
});

policy.evaluate({
  payload: authenticated.payload,
  policy: {
    name: 'sandbox.security.admin',
    requiredRoles: [
      'admin'
    ],
    requiredPermissions: [
      'security.auth.test'
    ],
    mode: 'all'
  }
});
```

---

## Imports públicos

```ts
import {
  SecurityAuthorizationService,
  SecurityAuthService,
  SecurityJwtService,
  SecurityPolicyService,
  assertSecurityJwtSecret,
  encodeSecurityJwtSecret,
  extractSecurityBearerToken,
  matchSecurityAuthorizationValues,
  normalizeSecurityAuthorizationValues
} from '@jarvis/security';

import type {
  SecurityAuthBearerOptions,
  SecurityAuthResult,
  SecurityAuthServiceOptions,
  SecurityAuthorizationMode,
  SecurityAuthorizationOptions,
  SecurityAuthorizationResult,
  SecurityJwtMetadata,
  SecurityJwtOptions,
  SecurityJwtPayload,
  SecurityJwtSignOptions,
  SecurityJwtTokenType,
  SecurityJwtVerifyResult,
  SecurityPolicy,
  SecurityPolicyOptions,
  SecurityPolicyResult
} from '@jarvis/security';
```

---

## Capacidades futuras

**`@jarvis/security`** está preparado para incorporar nuevas capacidades en versiones posteriores:

```txt
Hash de contraseñas
Login
Refresh tokens funcionales
Sesiones
Policies avanzadas con contexto
Guards
OAuth 2.0
Identity providers
Integración con @jarvis/database
```

---

## Hash de contraseñas

El hash de contraseñas será una capacidad propia de **`@jarvis/security`** para evitar almacenar contraseñas en texto plano.

El alcance esperado incluye:

```txt
- Generar hashes seguros.
- Verificar contraseñas contra hashes existentes.
- Definir parámetros seguros por defecto.
- Evitar exponer información sensible en errores.
- Permitir evolución futura de algoritmos.
```

---

## Login

El login será la capa encargada de validar credenciales y emitir tokens iniciales.

El alcance esperado incluye:

```txt
- Recibir credenciales.
- Validar identidad.
- Validar contraseña usando hash seguro.
- Emitir access token.
- Emitir refresh token cuando aplique.
- Registrar información de sesión.
- Devolver una respuesta autenticada normalizada.
```

El login no debe estar amarrado a una base de datos específica. La validación del usuario debe poder integrarse mediante servicios externos o implementaciones propias de cada aplicación.

---

## Refresh tokens funcionales

Los refresh tokens permitirán renovar sesiones sin obligar al usuario a iniciar sesión constantemente.

El alcance esperado incluye:

```txt
- Emitir refresh tokens.
- Verificar refresh tokens.
- Renovar access tokens.
- Asociar refresh tokens a una sesión.
- Revocar refresh tokens.
- Detectar refresh tokens inválidos o expirados.
- Separar claramente access tokens de refresh tokens.
```

---

## Sesiones

La capa de sesiones permitirá controlar el ciclo de vida de autenticaciones activas.

El alcance esperado incluye:

```txt
- Crear sesiones.
- Consultar sesiones.
- Cerrar sesiones.
- Revocar sesiones.
- Relacionar tokens con sessionId.
- Invalidar tokens asociados a sesiones cerradas.
- Mantener trazabilidad de accesos.
```

Las sesiones pueden vivir en distintos almacenes según la aplicación: memoria, base de datos, Redis u otro mecanismo externo.

---

## Policies avanzadas

Las policies avanzadas permitirán combinar condiciones más expresivas que roles y permisos.

Ejemplo conceptual:

```txt
El usuario puede editar un recurso si:
- tiene el permiso resource.update
- pertenece al mismo tenant
- el recurso no está bloqueado
```

El alcance esperado incluye:

```txt
- Ejecutar policies contra un contexto.
- Combinar roles, permisos, tenant, metadata y reglas de negocio.
- Evaluar recursos externos entregados por la aplicación.
- Devolver resultados autorizados o errores controlados.
```

---

## Guards

Los guards serán piezas reutilizables para proteger operaciones o rutas.

Un guard puede validar:

```txt
- Que exista autenticación.
- Que el token sea de tipo access.
- Que el usuario tenga ciertos roles.
- Que el usuario tenga ciertos permisos.
- Que una policy se cumpla.
- Que el token pertenezca al tenant esperado.
```

Los guards no deben depender directamente de un framework. La aplicación debe adaptarlos al servidor usado.

---

## OAuth 2.0

OAuth 2.0 será una capacidad futura para integraciones con proveedores externos de identidad.

El alcance esperado puede incluir:

```txt
- Autenticación con proveedores externos.
- Validación de tokens externos.
- Intercambio de códigos por tokens.
- Integración con usuarios internos.
- Normalización de perfiles externos.
- Manejo seguro de clientes, secretos y redirects.
```

OAuth 2.0 debe integrarse sin reemplazar la autenticación interna de **`J.A.R.V.I.S.`**, sino como una opción adicional para aplicaciones que lo requieran.

---

## Integración futura con @jarvis/database

Cuando exista **`@jarvis/database`**, una aplicación o provider podrá resolver usuarios, roles y permisos desde tablas reales y entregar esos datos a **`@jarvis/security`** para evaluación.

Flujo futuro:

```txt
JWT trae subject
↓
IdentityProvider consulta BD
↓
BD devuelve usuario, roles y permisos
↓
@jarvis/security autoriza la operación o evalúa una policy
```

La regla se mantiene:

```txt
@jarvis/security no consulta directamente la base de datos.
La aplicación o provider conecta @jarvis/security con @jarvis/database.
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
