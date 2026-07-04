# @jarvis/http

## Introducción

**`@jarvis/http`** es el paquete base de **`J.A.R.V.I.S.`** encargado de definir errores, códigos de estado y respuestas HTTP estandarizadas dentro del ecosistema.

Este paquete permite que las aplicaciones y futuros paquetes de **`J.A.R.V.I.S.`** usen un mismo lenguaje para construir respuestas exitosas, errores controlados y códigos internos de error sin duplicar lógica ni inventar estructuras diferentes en cada módulo.

---

## Objetivo

El objetivo de **`@jarvis/http`** es proporcionar una base común para manejar respuestas HTTP de forma consistente, segura y reutilizable.

Responsabilidades principales:

```txt
- Definir códigos de estado HTTP oficiales.
- Definir códigos internos de error.
- Crear errores HTTP controlados.
- Crear respuestas HTTP exitosas estandarizadas.
- Crear respuestas HTTP de error estandarizadas.
- Exponer helpers para errores comunes.
- Exponer utilidades para clasificar status codes.
```

---

## Funcionamiento

**`@jarvis/http`** no crea servidores, no registra rutas y no depende de Fastify.

Su responsabilidad es proporcionar contratos, clases y utilidades que puedan ser consumidos por otros paquetes o aplicaciones.

Flujo general:

```txt
Paquete o aplicación
↓
@jarvis/http
↓
JarvisHttpError / createSuccessResponse / createErrorResponse
↓
Respuesta HTTP estandarizada
```

Ejemplo de respuesta exitosa:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operación exitosa.",
  "data": {
    "status": "ok"
  }
}
```

Ejemplo de respuesta de error:

```json
{
  "success": false,
  "statusCode": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o ausente."
  }
}
```

---

## Uso

### Crear una respuesta exitosa

```ts
import {
  createSuccessResponse
} from '@jarvis/http';

const response = createSuccessResponse({
  message: 'Servidor activo.',
  data: {
    status: 'ok'
  }
});
```

### Crear un error controlado

```ts
import {
  unauthorized
} from '@jarvis/http';

throw unauthorized('Token inválido o ausente.');
```

### Convertir un error en respuesta HTTP

```ts
import {
  createErrorResponse
} from '@jarvis/http';

const response = createErrorResponse(error);
```

### Usar códigos HTTP oficiales

```ts
import {
  HTTP_STATUS
} from '@jarvis/http';

const statusCode = HTTP_STATUS.OK;
```

### Usar códigos internos de error

```ts
import {
  HTTP_ERROR_CODE
} from '@jarvis/http';

const code = HTTP_ERROR_CODE.UNAUTHORIZED;
```

---

## Helpers disponibles

Errores HTTP comunes:

```txt
badRequest()
unauthorized()
forbidden()
notFound()
conflict()
validationError()
tooManyRequests()
internalServerError()
serviceUnavailable()
```

Respuestas:

```txt
createSuccessResponse()
createErrorResponse()
```

Validaciones de status code:

```txt
isInformationalStatus()
isSuccessStatus()
isRedirectStatus()
isClientErrorStatus()
isServerErrorStatus()
isErrorStatus()
isHttpStatus()
isSupportedHttpStatus()
```

---

## Status codes soportados

```txt
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

---

## Notas

**`@jarvis/http`** es un paquete base del ecosistema.

No debe depender de:

```txt
- @jarvis/core
- @jarvis/security
- Fastify
- Base de datos
- Rutas HTTP
- Middlewares
```

Esto permite que pueda ser usado por distintos paquetes sin generar acoplamiento innecesario.

Este paquete será utilizado posteriormente por **`@jarvis/security`**, **`Sandbox API`** y otros módulos que necesiten respuestas HTTP estandarizadas.
