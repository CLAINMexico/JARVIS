# CHANGELOG | J.A.R.V.I.S.

## **`0.20.0`**

### Resumen

Se agregó **Bearer Auth universal** en **`@jarvis/security`**, permitiendo autenticar solicitudes mediante headers **`Authorization: Bearer <token>`** sin acoplar el paquete a frameworks HTTP específicos.

También se integró esta capacidad en **`Sandbox-API`** mediante un adaptador Fastify mínimo y rutas protegidas de prueba.

---

### Cambios

- Se agregó **`SecurityAuthService`** en **`@jarvis/security`**.
- Se agregó el contrato **`SecurityAuthBearerOptions`**.
- Se agregó el contrato **`SecurityAuthResult`**.
- Se agregó la utilidad **`extractSecurityBearerToken()`**.
- Se agregó validación de **`Authorization`** con esquema **`Bearer`**.
- Se agregó validación de **`allowedTokenTypes`**.
- Se agregaron errores controlados para autenticación Bearer mediante **`@jarvis/http`**.
- Se exportaron los nuevos contratos, servicios y utilidades desde **`@jarvis/security`**.
- Se integró **`SecurityAuthService`** en **`Sandbox-API`**.
- Se agregó un preHandler Fastify para rutas protegidas.
- Se agregó extensión de tipos de Fastify para soportar **`request.auth`**.
- Se agregaron rutas protegidas de prueba:
  - **`GET /security/protected`**
  - **`GET /security/me`**
- Se actualizó **`sandbox-api.http`** con pruebas documentadas de Bearer Auth.

---

### Mejoras

- **`@jarvis/security`** mantiene una arquitectura universal y desacoplada de frameworks HTTP.
- La aplicación es responsable de adaptar su framework al contrato de seguridad.
- Las rutas protegidas pueden restringir tokens mediante **`allowedTokenTypes`**.
- Se mantiene separación entre tokens **`access`**, **`refresh`** y **`service`**.
- Se agregan pruebas claras para casos exitosos y fallidos.
- Se mejora la trazabilidad mediante logs de autenticación exitosa y fallida.

---

### Correcciones

- Se ajustó el tipado para aceptar headers **`Authorization`** como **`string | null | undefined`**.
- Se evitó acoplar **`@jarvis/security`** a tipos de Fastify.
- Se resolvió la integración del preHandler de Fastify mediante adaptación en la aplicación.
- Se documentó el contexto autenticado **`request.auth`** como responsabilidad de **`Sandbox-API`**.

---

## **`0.19.1`**

### Resumen

Se ajustó la configuración de **`@jarvis/logger`** para agrupar sus salidas dentro de la sección **`transports`**, manteniendo una estructura más limpia, escalable y preparada para futuras salidas de log.

---

### Cambios

- Se actualizó el contrato **`LoggerOptions`** para mover la configuración de consola y archivos dentro de **`transports`**.
- Se actualizó **`createLoggerModule()`** para leer las salidas desde **`options.transports`**.
- Se actualizó el contrato **`BootstrapLogger`** para reflejar la nueva estructura normalizada.
- Se actualizó **`@jarvis/bootstrap`** para leer la configuración desde:
  - **`packages.logger.transports.console`**
  - **`packages.logger.transports.file`**
- Se actualizó la configuración de **`Sandbox-API`** para usar la estructura oficial de transports.

---

### Mejoras

- La configuración del logger queda mejor organizada.
- Se evita crecer propiedades directas dentro de **`packages.logger`**.
- Se deja preparada la estructura para futuros transports como:
  - **`database`**
  - **`http`**
  - **`cloud`**
  - **`otel`**
- Se conserva el switch maestro **`packages.logger.enabled`**.
- Se conserva la configuración de errores mediante **`packages.logger.error.verbose`**.
- Se mantiene compatibilidad funcional con los transports actuales de consola y archivo.

---

### Correcciones

- Se corrigió la estructura de configuración para alinear **`settings.json`**, **`@jarvis/bootstrap`** y **`@jarvis/logger`** bajo el mismo contrato de transports.
- Se evitó mantener **`console`** y **`file`** como propiedades directas de la configuración del logger.

---

## **`0.19.0`**

### Resumen

Se integró **`@jarvis/security`** con **`Sandbox-API`** mediante rutas HTTP reales para firmar y verificar tokens JWT.

También se homologaron rutas base de **`Sandbox-API`** con **`@jarvis/http`**, se agregó **`timeZone`** a **`core.info()`** y se incorporó en **`@jarvis/logger`** la configuración **`packages.logger.error.verbose`** para controlar si los errores se imprimen completos o resumidos.

---

### Cambios

- Se agregó **`@jarvis/security`** como dependencia de **`@jarvis/sandbox-api`**.
- Se creó resolución de opciones JWT para **`Sandbox-API`** desde **`api.jwt`**.
- Se definió **`issuer`** fijo como **`J.A.R.V.I.S.`**.
- Se definió **`audience`** desde **`app.name`**.
- Se agregó soporte para resolver **`api.jwt.secret`** desde variable de entorno cuando el valor de settings sea un placeholder.
- Se agregaron rutas HTTP de prueba:
  - **`POST /security/jwt/sign`**
  - **`POST /security/jwt/verify`**.
- Se homologaron rutas base usando **`@jarvis/http`**:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**.
- Se agregó colección **`sandbox-api.http`** para pruebas manuales desde REST Client.
- Se agregó **`timeZone`** a **`JarvisAppInfo`**.
- Se agregó normalización de **`timeZone`** dentro de **`@jarvis/core`**.
- Se agregó configuración oficial en **`@jarvis/logger`**:

```txt
packages.logger.error.verbose
```

- Se actualizó **`@jarvis/bootstrap`** para leer y entregar **`packages.logger.error.verbose`**.
- Se actualizó **`@jarvis/logger`** para serializar errores completos o resumidos según configuración.
- Se reorganizó el arranque de **`Sandbox-API`** para imprimir logs de boot más limpios:
  - Datos de la aplicación.
  - Packages cargados e inicializados.
  - Servidor iniciado.

---

### Mejoras

- Se validó el flujo completo:

```txt
settings.json
.env
Sandbox-API
@jarvis/security
@jarvis/http
@jarvis/logger
Fastify
```

- Se centralizó la serialización de errores dentro de **`@jarvis/logger`**.
- Se evitó que **`Sandbox-API`** necesite helpers locales para limpiar errores.
- Se mejoró la legibilidad de **`all.log`**.
- Se redujo el ruido de stack traces cuando **`packages.logger.error.verbose`** está en **`false`**.
- Se conserva la posibilidad de depurar con stack trace completo cuando **`packages.logger.error.verbose`** está en **`true`**.
- Se documentó la diferencia conceptual entre:
  - **`packages`**
  - **`runtimeModules`**
  - **`modules`** del runtime.
- Se dejó preparada la base para un futuro middleware HTTP de autenticación.

---

### Correcciones

- Se corrigió la respuesta cruda de rutas base para usar formato estándar de **`@jarvis/http`**.
- Se corrigió la ausencia de **`timeZone`** dentro de **`core.info()`**.
- Se corrigió la serialización de errores en logs para no imprimir stack traces cuando no son necesarios.
- Se validó que **`createErrorResponse()`** reciba errores controlados reales usando helpers oficiales como **`badRequest()`**.
- Se validaron rutas JWT con:
  - access token
  - refresh token
  - service token
  - token inválido
  - token ausente
  - payload sin tokenType.
- Se validó la versión mediante **`pnpm verify`** completo.

---

## **`0.18.1`**

### Resumen

Se realizó una limpieza estructural previa a la integración de **`@jarvis/security`** con **`Sandbox-API`**.

Esta versión renombra la sección **`settings.modules`** a **`settings.packages`** para alinear el lenguaje del proyecto y complementa la base JWT con tipos de token, expiración por tipo y un payload más cerrado.

---

### Cambios

- Se renombró la sección de configuración **`settings.modules`** a **`settings.packages`**.
- Se actualizó **`@jarvis/bootstrap`** para leer configuración del logger desde **`packages.logger`**.
- Se actualizó **`settings.example.json`**.
- Se actualizó **`settings.json`** local de **`Sandbox-API`**.
- Se agregó **`api.jwt.serviceTokenExpiresIn`**.
- Se definió que **`issuer`** no vive en **`settings.json`** porque se resuelve internamente como **`J.A.R.V.I.S.`**.
- Se definió que **`audience`** no vive en **`settings.json`** porque se resuelve internamente desde **`app.name`**.
- Se agregó **`SecurityJwtTokenType`** con los valores **`access`**, **`refresh`** y **`service`**.
- Se agregó **`SecurityJwtMetadata`**.
- Se cerró el contrato **`SecurityJwtPayload`** removiendo propiedades arbitrarias en la raíz.
- Se hizo obligatorio **`tokenType`** dentro de **`SecurityJwtPayload`**.
- Se agregó soporte para **`refreshTokenExpiresIn`** y **`serviceTokenExpiresIn`**.
- Se actualizó **`SecurityJwtService`** para resolver expiración por tipo de token.
- Se actualizó **`SecurityJwtSignOptions`** para permitir solo **`expiresIn`** como sobrescritura por firma.

---

### Mejoras

- Se aclaró la diferencia conceptual entre **`packages`** y **`runtimeModules`**.
- Se evita la confusión entre configuración de paquetes instalables y módulos vivos del runtime.
- Se prepara el terreno para declarar en el futuro **`packages.security`**.
- Se mejora el diseño JWT usando tipos explícitos:
  - **`access`** para acceso a rutas protegidas.
  - **`refresh`** para renovación de sesión.
  - **`service`** para comunicación interna entre servicios.
- Se centraliza la selección de expiración según **`payload.tokenType`**.
- Se reduce el riesgo de payloads demasiado abiertos.
- Se deja lista la configuración JWT para integración futura con **`Sandbox-API`**.

---

### Correcciones

- Se corrigieron referencias internas de **`modules.logger`** a **`packages.logger`**.
- Se corrigió el casteo del payload devuelto por **`jose`** usando una conversión controlada antes de validar la estructura esperada.
- Se validó el nuevo payload con access token, refresh token, service token, token inválido, token ausente y payload sin tokenType.
- Se removieron archivos y scripts temporales de prueba antes del cierre.
- Se validó la integración mediante:
  - **`pnpm --filter @jarvis/bootstrap build`**
  - **`pnpm --filter @jarvis/bootstrap typecheck`**
  - **`pnpm --filter @jarvis/security build`**
  - **`pnpm --filter @jarvis/security typecheck`**
  - **`pnpm build`**
  - **`pnpm typecheck`**.

---

## **`0.18.0`**

### Resumen

Se creó **`@jarvis/security`** como paquete base de seguridad para el ecosistema **`J.A.R.V.I.S.`**.

Esta primera versión incorpora soporte inicial para **JWT**, permitiendo firmar y verificar tokens mediante un servicio dedicado, usando **`jose`** como librería JWT moderna compatible con TypeScript y ESM.

La versión también integra errores controlados mediante **`@jarvis/http`** para tokens inválidos, expirados o ausentes.

---

### Cambios

- Se creó el paquete **`packages/security`**.
- Se agregó el package workspace **`@jarvis/security`**.
- Se agregó la dependencia **`jose`**.
- Se agregó dependencia interna a **`@jarvis/http`**.
- Se actualizó el **`package.json`** raíz a versión **`0.18.0`**.
- Se agregó **`@jarvis/security`** a los scripts raíz:
  - **`clean:packages`**
  - **`build:packages`**
  - **`typecheck:packages`**.
- Se creó el contrato **`SecurityJwtPayload`**.
- Se creó el contrato **`SecurityJwtOptions`**.
- Se creó el contrato **`SecurityJwtSignOptions`**.
- Se creó el contrato **`SecurityJwtVerifyResult`**.
- Se creó el servicio **`SecurityJwtService`**.
- Se crearon utilidades JWT:
  - **`encodeSecurityJwtSecret()`**
  - **`assertSecurityJwtSecret()`**.
- Se agregaron exports públicos desde **`packages/security/src/index.ts`**.
- Se agregó **`JarvisSecurityPackage`** como metadata pública del paquete.

---

### Mejoras

- Se agregó firma de tokens JWT con algoritmo **`HS256`**.
- Se agregó soporte para claims estándar:
  - **`sub`**
  - **`iat`**
  - **`exp`**
  - **`iss`**
  - **`aud`**.
- Se agregó verificación de tokens JWT.
- Se agregó normalización del resultado de verificación.
- Se agregó soporte para **`issuer`** y **`audience`** por configuración.
- Se agregó soporte para expiración configurable mediante **`accessTokenExpiresIn`**.
- Se agregó soporte para opciones específicas de firma mediante **`SecurityJwtSignOptions`**.
- Se agregó validación de secreto JWT vacío.
- Se agregó validación de token vacío.
- Se preparó el paquete para futuras etapas de seguridad:
  - middleware HTTP
  - login
  - hash de contraseñas
  - refresh tokens
  - sesiones
  - roles
  - permisos
  - policies
  - guards
  - OAuth 2.0.

---

### Correcciones

- Se resolvió compatibilidad con **`exactOptionalPropertyTypes`** usando propiedades internas como **`string | undefined`** cuando corresponde.
- Se validó que **`SecurityJwtService`** pueda firmar y verificar tokens correctamente.
- Se validó que un token inválido produzca un error controlado **`UNAUTHORIZED`** desde **`@jarvis/http`**.
- Se validó que un token ausente produzca un error controlado específico.
- Se removió el archivo temporal de prueba JWT antes del cierre técnico.
- Se removió el script temporal **`test:jwt`** antes del cierre técnico.
- Se validó la integración completa mediante:
  - **`pnpm --filter @jarvis/security build`**
  - **`pnpm --filter @jarvis/security typecheck`**
  - **`pnpm build`**
  - **`pnpm typecheck`**.

---

## **`0.17.0`**

### Resumen

Se homologó **`@jarvis/logger`** como sistema oficial de bitácoras para el ecosistema **`J.A.R.V.I.S.`**, incorporando un formato estándar para consola y archivos, soporte explícito para paquete origen, aplicación, eventos técnicos y códigos de estado HTTP opcionales.

Esta versión también simplifica la estructura física de archivos de log y valida la integración real entre **`@jarvis/logger`**, **`@jarvis/http`** y **`Sandbox-API`**.

---

### Cambios

- Se actualizó el contrato **`LoggerContext`** para soportar formalmente **`package`**, **`module`**, **`event`**, **`statusCode`**, **`error`** y metadata adicional.
- Se actualizó el contrato **`LoggerEntry`** para incluir campos normalizados: **`appName`**, **`package`**, **`module`**, **`event`** y **`statusCode`**.
- Se agregó **`defaultPackage`** a **`LoggerOptions`**.
- Se actualizó **`LoggerServiceOptions`** para recibir **`appName`**, **`defaultPackage`**, **`defaultModule`**, **`timeZone`** y **`transports`**.
- Se actualizó **`LoggerService`** para construir entradas de log homologadas.
- Se agregó el método **`package(packageName)`** en **`LoggerService`** para crear loggers asociados a un paquete específico.
- Se actualizó **`createLoggerModule()`** para normalizar y entregar **`appName`** y **`defaultPackage`** al servicio.
- Se actualizó **`@jarvis/bootstrap`** para generar valores visuales de logger: **`appName: J.A.R.V.I.S. | App`**, **`defaultPackage`** y **`defaultModule`**.
- Se actualizó **`BootstrapLogger`** para incluir **`defaultPackage`**.
- Se ajustó **`Sandbox-API`** para usar el nuevo contexto del logger en sus mensajes principales.
- Se agregaron logs de prueba en las rutas **`GET /http/success`** y **`GET /http/error`**.

---

### Mejoras

- Se homologó el formato oficial de logs:

```txt
[YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] | [STATUSCODE] - MESSAGE
```

- Se agregó soporte para omitir **`statusCode`** cuando el evento no pertenece a una operación HTTP:

```txt
[YYYY-MM-DD HH:mm:ss] [TYPE] [PACKAGE] [J.A.R.V.I.S. | APP] - MESSAGE
```

- Se eliminó el padding visual en niveles de log: antes **`[INFO ]`**, ahora **`[INFO]`**.
- Se simplificó la estructura de archivos de log.
- La ruta conserva la fecha:

```txt
logs/YYYY/MM/DD/
```

- Los archivos ahora se nombran únicamente por nivel:

```txt
all.log
debug.log
info.log
warn.log
error.log
fatal.log
```

- Se eliminó el uso de nombres largos de archivo como **`YYYY_MM_DD_APP_LEVEL.log`**.
- Se estableció la regla interna:

```txt
La ruta organiza por fecha.
El archivo organiza por nivel.
La línea del log contiene el contexto.
```

- Se limpió el contexto adicional para evitar duplicar campos ya impresos en la línea principal: **`package`**, **`module`**, **`event`** y **`statusCode`**.
- Se mantiene la normalización de errores para evitar salidas vacías al serializar instancias de **`Error`**.
- Se documentó el nuevo formato de **`@jarvis/logger`**.
- Se documentaron las rutas de prueba de **`Sandbox-API`** para validar integración entre **`@jarvis/http`** y **`@jarvis/logger`**.

---

### Correcciones

- Se corrigió el uso de **`appName`** dentro de **`@jarvis/bootstrap`**, dejando de usar valores técnicos como **`JARVIS_SANDBOXAPI`** para impresión visual.
- Se corrigió la salida visual de logs para mostrar **`[J.A.R.V.I.S. | Sandbox-API]`** en lugar de **`[JARVIS_SANDBOXAPI]`**.
- Se corrigió la exportación pública de utilidades de path en **`@jarvis/logger`**, removiendo referencias a utilidades eliminadas.
- Se ajustó **`LoggerFileTransport`** para dejar de depender de **`appName`** en la construcción de nombres de archivo.
- Se corrigieron advertencias de TypeScript en **`Sandbox-API`** validando explícitamente los servicios **`config`** y **`logger`** antes de usarlos.
- Se validó la integración completa mediante builds, typechecks y pruebas reales en runtime con **`Sandbox-API`**.

---

## **`0.16.0`**

### Resumen

Se agrega el paquete **`@jarvis/http`** como base oficial para manejar errores, códigos de estado y respuestas HTTP estandarizadas dentro del ecosistema **`J.A.R.V.I.S.`**.

Esta versión define un lenguaje común para construir respuestas exitosas, errores controlados y códigos internos de error sin duplicar lógica en cada paquete o aplicación.

---

### Cambios

- Se agregó el nuevo paquete **`packages/http`**.
- Se agregó el catálogo oficial **`HTTP_STATUS`**.
- Se agregó el catálogo oficial **`HTTP_ERROR_CODE`**.
- Se agregó el contrato **`HttpErrorOptions`**.
- Se agregó el contrato **`HttpErrorResponse`**.
- Se agregó el contrato **`HttpSuccessResponse`**.
- Se agregó la clase **`JarvisHttpError`**.
- Se agregó el type guard **`isJarvisHttpError()`**.
- Se agregaron helpers para crear errores HTTP comunes:
  - **`badRequest()`**
  - **`unauthorized()`**
  - **`forbidden()`**
  - **`notFound()`**
  - **`conflict()`**
  - **`validationError()`**
  - **`tooManyRequests()`**
  - **`internalServerError()`**
  - **`serviceUnavailable()`**
- Se agregaron helpers para crear respuestas estándar:
  - **`createSuccessResponse()`**
  - **`createErrorResponse()`**
- Se agregaron utilidades para clasificar status codes HTTP.
- Se integró **`@jarvis/http`** en **`apps/sandbox-api`** para validar consumo real desde otro workspace.
- Se agregaron rutas de prueba en **`Sandbox API`**:
  - **`GET /http/success`**
  - **`GET /http/error`**
- Se actualizó **`apps/sandbox-api/http/sandbox-api.http`** para probar las nuevas rutas desde REST Client.
- Se actualizó el **`package.json`** raíz para incluir **`@jarvis/http`** en los scripts de paquetes.

---

### Mejoras

- Se estandariza el formato de respuestas HTTP exitosas.
- Se estandariza el formato de respuestas HTTP de error.
- Se evita usar números mágicos para status codes HTTP.
- Se evita inventar códigos internos de error en cada paquete.
- Se facilita la futura integración con **`@jarvis/security`**.
- Se mantiene **`@jarvis/http`** independiente de Fastify, rutas, middlewares, base de datos y seguridad.
- Se valida que **`@jarvis/http`** compile como paquete independiente y también funcione consumido desde **`Sandbox API`**.

---

### Correcciones

- Se agregaron códigos HTTP de éxito **`200`**, **`201`** y **`204`** al catálogo oficial para soportar respuestas exitosas.
- Se ajustó **`createSuccessResponse()`** para usar **`HTTP_STATUS.OK`** en lugar de un valor numérico directo.
- Se respetó **`exactOptionalPropertyTypes`** evitando propiedades opcionales con valor **`undefined`**.
- Se validaron respuestas reales desde REST Client:
  - **`GET /http/success`**
  - **`GET /http/error`**
- Se verificó correctamente el paquete mediante:

```bash
docker compose exec jarvis-node pnpm --filter @jarvis/http build
docker compose exec jarvis-node pnpm --filter @jarvis/http typecheck
```

- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.15.0`**

### Resumen

Se agrega soporte inicial para **HTTP/HTTPS configurable** en **`J.A.R.V.I.S.`** y **`Sandbox-API`**.

Esta versión permite definir desde **`settings.json`** si la aplicación debe arrancar usando **HTTP** o **HTTPS**, normalizando la configuración desde **`@jarvis/bootstrap`**, exponiéndola desde **`@jarvis/core`** y consumiéndola desde **`apps/sandbox-api`** para crear el servidor Fastify correspondiente.

---

### Cambios

- Se agregó soporte para **`server.protocol`** con valores **`http`** y **`https`**.
- Se agregó soporte para **`server.https.enabled`**.
- Se agregó soporte para **`server.https.keyFile`**.
- Se agregó soporte para **`server.https.certFile`**.
- Se actualizó **`@jarvis/core`** para transportar y reportar configuración HTTP/HTTPS desde **`core.info().server`**.
- Se actualizó **`@jarvis/bootstrap`** para leer, normalizar y validar la configuración HTTP/HTTPS desde **`settings.json`**.
- Se actualizó **`Sandbox-API`** para crear Fastify en modo HTTP o HTTPS según la configuración normalizada del runtime.
- Se agregó **`sandbox-http-options.ts`** para resolver opciones HTTP/HTTPS de **`Sandbox-API`** desde **`core.info().server`**.
- Se actualizó **`sandbox-http-server.ts`** para leer certificados locales cuando HTTPS está activo.
- Se actualizó **`sandbox-api.http`** para permitir pruebas con **HTTP** o **HTTPS** desde REST Client.
- Se agregó carpeta **`apps/sandbox-api/certs/`** para certificados locales de prueba.
- Se agregó documentación para generar certificados autofirmados locales.
- Se actualizó **`.gitignore`** para evitar publicar certificados, llaves privadas y archivos sensibles de certificados.

---

### Mejoras

- La configuración de transporte deja de estar resuelta únicamente por **`Sandbox-API`** y pasa a formar parte de la configuración formal del runtime.
- **`@jarvis/bootstrap`** valida errores de configuración antes de arrancar el core.
- **`@jarvis/core`** expone una estructura de servidor más completa mediante **`core.info().server`**.
- **`Sandbox-API`** consume la configuración oficial del runtime en lugar de interpretar directamente **`settings.json`**.
- Se mantiene una segunda validación local en **`Sandbox-API`** antes de crear el servidor HTTP/HTTPS.
- Se mejora la seguridad de pruebas locales al permitir HTTPS con certificados autofirmados.
- Se mantiene compatibilidad con HTTP para escenarios simples de desarrollo.
- Se prepara la base técnica para futuras integraciones de seguridad como **`@jarvis/security`**.

---

### Correcciones

- Se evitó publicar certificados reales o llaves privadas en el repositorio.
- Se ajustaron propiedades opcionales para respetar **`exactOptionalPropertyTypes`**.
- Se evitó agregar propiedades opcionales con valor **`undefined`** en configuraciones HTTPS.
- Se validó el funcionamiento de las rutas base usando HTTP y HTTPS:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**
- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.14.0`**

### Resumen

Se separa la responsabilidad HTTP de **`apps/sandbox-api/src/main.ts`** en archivos dedicados para servidor y rutas.

Esta versión mantiene el mismo comportamiento público agregado en **`v0.13.0`**, pero mejora la estructura interna de **`Sandbox-API`** para preparar el crecimiento ordenado de rutas, configuración HTTP y futuras integraciones.

---

### Cambios

- Se agregó la carpeta **`apps/sandbox-api/src/http/`**.
- Se agregó **`sandbox-http-server.ts`** para centralizar la creación del servidor HTTP con **`Fastify`**.
- Se agregó **`sandbox-http-routes.ts`** para centralizar el registro de rutas HTTP base.
- Se actualizó **`main.ts`** para delegar la creación del servidor y el registro de rutas.
- Se conservaron las rutas existentes:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**

---

### Mejoras

- **`main.ts`** queda enfocado como orquestador del arranque general de **`Sandbox-API`**.
- La creación del servidor HTTP queda aislada en **`sandbox-http-server.ts`**.
- El registro de rutas HTTP queda aislado en **`sandbox-http-routes.ts`**.
- Se mejora la mantenibilidad de **`Sandbox-API`** antes de agregar configuración HTTP avanzada, HTTPS, seguridad o rutas de negocio.
- Se conserva el apagado seguro de servidor HTTP y runtime.
- Se mantiene compatibilidad con las pruebas HTTP versionables mediante **`sandbox-api.http`**.

---

### Correcciones

- No se modifica el comportamiento público de las rutas HTTP existentes.
- Se validó que las rutas base siguen respondiendo correctamente desde REST Client:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**
- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.13.1`**

### Resumen

Se agregan pruebas HTTP versionables para **`apps/sandbox-api`** usando archivos compatibles con la extensión **REST Client** de VS Code.

---

### Cambios

- Se agregó la carpeta **`apps/sandbox-api/http/`**.
- Se agregó el archivo **`sandbox-api.http`** con peticiones base del sandbox.
- Se documentó el uso de pruebas HTTP desde VS Code.

---

### Mejoras

- Se facilita la validación manual de rutas HTTP.
- Se agregan pruebas versionables junto al código del sandbox.
- Se refuerza la documentación ejecutable para las rutas:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**

---

### Correcciones

- No aplica.

---

## **`0.13.0`**

### Resumen

Se agrega el primer servidor HTTP de **`J.A.R.V.I.S.`** dentro de **`apps/sandbox-api`** usando **Fastify**.

Esta versión permite validar que el runtime no solo arranca internamente, sino que también puede exponer información básica por HTTP mediante rutas iniciales del sandbox.

---

### Cambios

- Se agregó **Fastify** como dependencia de **`apps/sandbox-api`**.
- Se actualizó **`apps/sandbox-api/src/main.ts`** para crear un servidor HTTP.
- Se agregó ruta raíz **`GET /`** para mostrar información general de la API.
- Se agregó ruta **`GET /health`** para validar que el servidor está activo.
- Se agregó ruta **`GET /info`** para exponer la información general del runtime mediante **`core.info()`**.
- Se agregó ruta **`GET /modules`** para exponer los módulos registrados mediante **`core.modules()`**.
- Se adaptó el apagado seguro para cerrar primero el servidor HTTP y después ejecutar **`core.shutdown()`**.

---

### Mejoras

- **`Sandbox-API`** deja de ser únicamente un flujo de consola y comienza a funcionar como una API backend inicial.
- Se valida que **`J.A.R.V.I.S.`** puede arrancar, montar módulos y responder peticiones HTTP.
- Se mantiene el manejo seguro de errores agregado en **`v0.12.0`**.
- Se mantiene la separación de responsabilidades entre **`@jarvis/bootstrap`**, **`@jarvis/config`**, **`@jarvis/logger`**, **`@jarvis/core`** y la aplicación **`apps/sandbox-api`**.
- Se prepara la base para futuras rutas HTTP, health checks, plugins, controladores y middlewares.

---

### Correcciones

- Se evita ejecutar **`core.shutdown()`** al finalizar el flujo normal, ya que ahora el servidor HTTP debe permanecer activo.
- Se ajustó el apagado seguro para responder a señales del sistema como **`SIGINT`** y **`SIGTERM`**.
- Se verificó que las rutas base respondan correctamente:
  - **`GET /`**
  - **`GET /health`**
  - **`GET /info`**
  - **`GET /modules`**
- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.12.0`**

### Resumen

Se refuerza el arranque de **`apps/sandbox-api`** mediante una estructura controlada basada en **`main()`**, manejo seguro de errores y apagado ordenado del runtime.

Esta versión convierte el sandbox de un flujo lineal de prueba a una base más robusta para futuras aplicaciones backend construidas sobre **`J.A.R.V.I.S.`**.

---

### Cambios

- Se refactorizó **`apps/sandbox-api/src/main.ts`** para concentrar el flujo principal dentro de una función **`main()`**.
- Se agregó manejo de errores mediante **`try/catch/finally`**.
- Se agregó control para errores ocurridos antes de inicializar **`LoggerService`**.
- Se agregó control para errores ocurridos después de inicializar **`LoggerService`**.
- Se agregó apagado seguro del runtime mediante **`core.shutdown()`** dentro de **`finally`**.
- Se protegió la impresión completa de configuración cuando la aplicación corre en ambiente **`production`**.

---

### Mejoras

- Se mejora la estabilidad del flujo de arranque de **`Sandbox-API`**.
- Se evita que un error durante el arranque deje módulos vivos sin ejecutar su apagado.
- Se separa el reporte de errores según disponibilidad del logger:
  - **`console.error()`** para errores tempranos.
  - **`logger.fatal()`** para errores posteriores a la inicialización del logger.
- Se mejora la preparación de **`apps/sandbox-api`** como base para futuras integraciones HTTP.
- Se mantiene la separación de responsabilidades entre **`@jarvis/bootstrap`**, **`@jarvis/config`**, **`@jarvis/logger`** y **`@jarvis/core`**.

---

### Correcciones

- Se evita que **`core.shutdown()`** dependa de que todo el flujo haya terminado correctamente.
- Se evita imprimir configuración completa en ambiente **`production`**.
- Se validó el manejo de errores controlados antes y después de inicializar el logger.
- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.11.0`**

### Resumen

Se realiza una homologación documental y estructural en los paquetes principales de **`J.A.R.V.I.S.`**, alineando nombres de archivos, comentarios internos, README y documentación técnica bajo una misma convención.

Esta versión deja una base más limpia, consistente y mantenible para continuar el crecimiento del ecosistema.

---

### Cambios

- Se homologó la documentación interna de **`@jarvis/core`**.
- Se homologó la documentación interna de **`@jarvis/config`**.
- Se homologó la documentación interna de **`@jarvis/bootstrap`**.
- Se homologó la documentación interna de **`@jarvis/logger`**.
- Se actualizó el README raíz con una estructura más clara y consistente.
- Se actualizaron los README de paquetes usando la estructura:
  - **Introducción**
  - **Objetivo**
  - **Funcionamiento**
  - **Uso**
  - **Notas**
- Se reforzó la nomenclatura interna de archivos por responsabilidad y carpeta.
- Se dejó como regla documental que todo archivo nuevo debe crearse con comentarios claros, consistentes y en español.

---

### Mejoras

- Se mejoró la claridad de contratos, runtime, utilidades, formatters y transports.
- Se aclaró la diferencia entre módulos informativos y módulos vivos del runtime.
- Se reforzó la documentación del ciclo de vida de módulos mediante **`boot()`** y **`shutdown()`**.
- Se documentó con mayor precisión el registro y consulta de servicios mediante **`core.service(name)`**.
- Se mejoró la documentación del flujo entre **`@jarvis/bootstrap`**, **`@jarvis/config`**, **`@jarvis/logger`** y **`@jarvis/core`**.
- Se mejoró la documentación del logger, incluyendo niveles, transports, formatters, contexto, errores, zona horaria y escritura ordenada.
- Se reforzaron notas de seguridad sobre no imprimir secretos ni configuración sensible en logs.
- Se dejó más clara la responsabilidad de cada paquete para evitar mezcla de lógica entre módulos.

---

### Correcciones

- Se corrigieron inconsistencias de nombres y comentarios entre archivos.
- Se eliminaron comentarios redundantes o desactualizados.
- Se corrigieron referencias documentales incorrectas, como menciones a métodos o responsabilidades que ya no aplicaban.
- Se ajustó la documentación de **`settings.json`** y **`.env`** para separar configuración no sensible de secretos reales.
- Se validó que **`settings.json`** cargado por **`@jarvis/config`** tenga un objeto JSON válido como raíz.
- Se verificó correctamente el proyecto mediante:

```bash
docker compose exec jarvis-node pnpm verify
```

---

## **`0.10.4`**

### Resumen

Complemento en documentación completa del proyecto en **`README.md`**

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.10.3`**

### Resumen

Complemento en documentación del proyecto

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.10.2`**

### Resumen

Se agrega el **CHANGELOG.md** raíz del monorepo para concentrar el historial oficial de cambios de **`J.A.R.V.I.S.`** durante la etapa inicial del proyecto.

Esta versión no modifica lógica del runtime. Su objetivo es ordenar la documentación histórica del proyecto y establecer una regla clara para el manejo de changelog durante la línea **v0.x.x**.

---

### Cambios

- Se agrega **CHANGELOG.md** en la raíz del monorepo.
- Se documenta el historial inicial del proyecto desde **v0.1.0** hasta **v0.10.2**.
- Se define que, durante la etapa **0.x.x**, el historial de cambios se concentrará únicamente en el changelog raíz.
- Se define que los changelog por package se incorporarán cuando **`J.A.R.V.I.S.`** alcance una primera versión estable completa en la línea **v1.x.x**.
- Se conserva el versionado oficial del monorepo mediante tags **v0.x.x**.
- Se documenta que los packages internos pueden mantener versión base **1.0.0** durante la etapa inicial.

---

### Mejoras

- Se mejora la trazabilidad documental del proyecto.
- Se evita crear changelog por package antes de que los packages alcancen estabilidad funcional.
- Se establece una estructura simple, legible y consistente para futuras entradas del changelog.

---

### Correcciones

- No aplica. Esta versión es documental.

---

## **`0.10.1`**

### Resumen

Se corrige el comportamiento de **@jarvis/logger** para respetar **packages.logger.enabled = false** como switch maestro del módulo.

---

### Cambios

- Se agrega soporte efectivo para **enabled** a nivel general del módulo logger.
- Se mantiene **LoggerService** disponible aunque el logger esté apagado.
- Se evita crear transports cuando **packages.logger.enabled** está en **false**.
- Se evita escribir logs internos de **boot()** y **shutdown()** cuando el logger está deshabilitado.
- Se conserva el comportamiento de **console.enabled** y **file.enabled** como switches específicos de salida.

---

### Mejoras

- Se establece una regla reutilizable para futuros módulos:
  - **enabled** del módulo funciona como switch maestro.
  - **enabled** interno funciona como switch específico de salida, transport, proveedor o canal.
- Se mejora la seguridad del flujo, permitiendo que otros packages consulten **core.service('logger')** sin romper aunque el logger esté apagado.

---

### Correcciones

- Se corrige que **packages.logger.enabled = false** no apagara completamente la escritura del logger.
- Se corrige que el logger pudiera seguir escribiendo mensajes de arranque o apagado aunque el módulo estuviera deshabilitado.

---

## **`0.10.0`**

### Resumen

Se agrega el primer módulo real de logging del ecosistema **`J.A.R.V.I.S.`** mediante **@jarvis/logger**.

---

### Cambios

- Se agrega **@jarvis/logger** como package funcional del monorepo.
- Se implementa **LoggerService** como servicio consumible desde **core.service('logger')**.
- Se agrega **createLoggerModule()** para montar logger como módulo vivo del runtime.
- Se agregan niveles de log: **debug**, **info**, **warn**, **error** y **fatal**.
- Se agrega salida a consola con soporte opcional para colores ANSI.
- Se agrega salida a archivos dentro de **logs/YYYY/MM/DD/**.
- Se agrega archivo concentrado **ALL.log**.
- Se agrega escritura separada por nivel.
- Se agrega soporte para **timeZone**.
- Se agrega cola interna de escritura para mantener el orden de los logs.
- Se agrega soporte para metadata, objetos y arreglos en formato JSON legible.
- Se agrega normalización de errores para imprimir **name**, **message** y **stack**.
- Se integra **@jarvis/logger** con **@jarvis/bootstrap**.
- Se integra **@jarvis/logger** dentro de **apps/sandbox-api**.

---

### Mejoras

- Se reemplazan salidas simples por un sistema formal de logging.
- Se mejora la depuración del runtime mediante logs estructurados.
- Se mejora la lectura de contexto técnico mediante JSON indentado.
- Se prepara la base para futuros transports y estrategias de logging.

---

### Correcciones

- Se corrige el orden de escritura en archivos mediante una cola interna.
- Se corrige el manejo de fechas locales con zona horaria configurable.
- Se evita el uso de símbolos o emojis en archivos de log para mantener compatibilidad multiplataforma.

---

## **`0.9.0`**

### Resumen

Se agrega **@jarvis/bootstrap** como package encargado de preparar la configuración inicial de una aplicación antes de arrancar el runtime.

---

### Cambios

- Se crea el package **@jarvis/bootstrap**.
- Se agrega **createJarvisBootstrap()** como API principal del package.
- Se agregan contratos para **BootstrapOptions**, **BootstrapResult**, **BootstrapApp**, **BootstrapServer** y **BootstrapLogger**.
- Se agregan utilidades para normalizar valores de bootstrap.
- Se integra **@jarvis/bootstrap** con **@jarvis/config**.
- Se actualiza **apps/sandbox-api** para probar el flujo de bootstrap.
- Se normaliza configuración inicial de **app**, **server** y **logger**.

---

### Mejoras

- Se separa la preparación de la app del arranque del core.
- Se mantiene **@jarvis/core** limpio y desacoplado de la lectura de archivos.
- Se evita duplicar lógica de lectura de **settings.json**.

---

### Correcciones

- Se corrige el manejo de propiedades opcionales para evitar retornar valores **undefined** con **exactOptionalPropertyTypes**.
- Se ajusta el flujo para cargar settings una sola vez y reutilizarlos desde **ConfigService**.

---

## **`0.8.0`**

### Resumen

Se agrega el registro inicial de servicios en **@jarvis/core**.

---

### Cambios

- Se extiende el contrato **JarvisRuntimeModule** para aceptar la propiedad opcional **service**.
- Se agrega un mapa interno de servicios dentro de **JarvisApplication**.
- Se registra automáticamente el servicio de cada módulo vivo cuando existe.
- Se agrega el método **core.service<T>(name)**.

---

### Mejoras

- Se permite que packages como **@jarvis/config** y **@jarvis/logger** expongan servicios reales.
- Se mejora la comunicación entre core y módulos vivos.

---

### Correcciones

- No aplica.

---

## **`0.7.1`**

### Resumen

Se homologa la documentación del monorepo después de integrar el primer módulo real de configuración.

---

### Cambios

- Se actualiza documentación raíz.
- Se ajusta documentación de **@jarvis/core**.
- Se ajusta documentación de **@jarvis/config**.
- Se ajusta documentación de **apps/sandbox-api**.

---

### Mejoras

- Se mejora la consistencia de documentación entre packages y sandbox.
- Se aclaran responsabilidades de core, config y sandbox.

---

### Correcciones

- Se corrigen textos y estructura documental para mantener una línea común en el proyecto.

---

## **`0.7.0`**

### Resumen

Se agrega **@jarvis/config** como primer módulo real del ecosistema **`J.A.R.V.I.S.`**

---

### Cambios

- Se crea el package **@jarvis/config**.
- Se agregan contratos de configuración.
- Se implementa **ConfigService**.
- Se implementa lectura de archivos JSON mediante **loadConfigFile()**.
- Se implementa **createConfigModule()** como módulo vivo compatible con **@jarvis/core**.
- Se integra **@jarvis/config** en **apps/sandbox-api**.
- Se agrega soporte para cargar valores directos mediante **values**.
- Se agrega soporte para cargar configuración desde archivo mediante **file**.

---

### Mejoras

- Se sustituye configuración falsa por un package real.
- Se prepara el flujo para usar **settings.json** por app.
- Se agrega validación básica para asegurar que la raíz del archivo JSON sea un objeto válido.

---

### Correcciones

- Se agregan errores claros cuando un archivo de configuración no puede leerse o no tiene formato válido.

---

## **`0.6.1`**

### Resumen

Se agrega documentación y configuración base para **apps/sandbox-api**.

---

### Cambios

- Se agregan archivos de ejemplo para configuración del sandbox.
- Se documenta el uso de **settings.example.json**.
- Se documenta el uso de **.env.example**.
- Se actualizan README de core y sandbox.

---

### Mejoras

- Se aclara la separación entre configuración no sensible y secretos.
- Se establece la regla de **settings.json** para configuración no sensible y **.env** para secretos reales.

---

### Correcciones

- Se corrigen detalles de documentación inicial.

---

## **`0.6.0`**

### Resumen

Se agrega el ciclo de vida inicial de módulos vivos en **@jarvis/core**.

---

### Cambios

- Se define el concepto de módulos vivos del runtime.
- Se agrega soporte para ejecutar **boot()**.
- Se agrega soporte para ejecutar **shutdown()**.
- Se define el orden de arranque de módulos.
- Se define el apagado en orden inverso.

---

### Mejoras

- Se prepara el runtime para inicializar y apagar packages reales.

---

### Correcciones

- No aplica.

---

## **`0.5.2`**

### Resumen

Se agrega documentación inicial de core, sandbox y versiones.

---

### Cambios

- Se documenta el estado del core.
- Se documenta el objetivo de sandbox-api.
- Se registran notas iniciales de versionado.
- Se mejora la documentación del monorepo.

---

### Mejoras

- Se facilita la lectura del proyecto para futuras integraciones.

---

### Correcciones

- Se corrigen detalles menores de documentación.

---

## **`0.5.1`**

### Resumen

Complemento para el registro inicial de módulos dentro de **`@jarvis/core`**

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.5.0`**

### Resumen

Se agrega el registro inicial de módulos dentro de **@jarvis/core**.

---

### Cambios

- Se agrega estructura para registrar módulos del runtime.
- Se agregan contratos iniciales para módulos.
- Se prepara el core para manejar módulos informativos y vivos.

---

### Mejoras

- Se avanza hacia una arquitectura modular.

---

### Correcciones

- No aplica.

---

## **`0.4.0`**

### Resumen

Se agrega el bootstrap inicial de **@jarvis/core**.

---

### Cambios

- Se implementa **Jarvis.boot()**.
- Se crea una primera instancia de runtime.
- Se normalizan valores básicos de aplicación.
- Se prepara **JarvisApplication** como clase principal del runtime.

---

### Mejoras

- Se establece el punto de entrada formal del core.

---

### Correcciones

- No aplica.

---

## **`0.3.0`**

### Resumen

Se conecta la estructura inicial de packages dentro del monorepo.

---

### Cambios

- Se habilita el trabajo con **pnpm workspaces**.
- Se conecta **@jarvis/core** con el sandbox inicial.
- Se prepara el flujo de build y typecheck por package.

---

### Mejoras

- Se permite compilar packages internos.

---

### Correcciones

- No aplica.

---

## **`0.2.3`**

### Resumen

Correcciones en estructura de archivo **`package.json`**

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.2.2`**

### Resumen

Correcciones de verbos, coherencia y ajuste de contexto en archivos README.md

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.2.1`**

### Resumen

Se complementa documentación inicial e integración de imagen oficial del desarrollo

---

### Cambios

- No aplica.

---

### Mejoras

- No aplica.

---

### Correcciones

- No aplica.

---

## **`0.2.0`**

### Resumen

Se prepara el ambiente base del proyecto, documentación inicial y branding.

---

### Cambios

- Se agrega ambiente Docker base.
- Se agregan archivos de configuración inicial.
- Se agrega documentación base del monorepo.
- Se agregan assets iniciales de branding.
- Se agregan reglas iniciales de ignorado para archivos generados y locales.

---

### Mejoras

- Se facilita levantar el entorno de desarrollo.
- Se establece una identidad inicial del proyecto.

---

### Correcciones

- Se ajustan detalles iniciales de configuración del ambiente.

---

## **`0.1.0`**

### Resumen

Se crea la estructura inicial del monorepo **`J.A.R.V.I.S.`**

---

### Cambios

- Se crea la estructura base del repositorio.
- Se agregan carpetas iniciales para apps y packages.
- Se prepara la base del monorepo.
- Se define el nombre del proyecto: **JavaScript Architecture Runtime for Versatile Intelligent Services**.

---

### Mejoras

- Se establece el punto de partida para el desarrollo del ecosistema **`J.A.R.V.I.S.`**

---

### Correcciones

- No aplica.

---
