# CHANGELOG | J.A.R.V.I.S.

## **`0.14.0`** <sup><small>(26/Junio/2026)</small></sup>

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

## **`0.13.1`** <sup><small>(26/Junio/2026)</small></sup>

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

## **`0.13.0`** <sup><small>(26/Junio/2026)</small></sup>

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

## **`0.12.0`** <sup><small>(26/Junio/2026)</small></sup>

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

## **`0.11.0`** <sup><small>(26/Junio/2026)</small></sup>

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

## **`0.10.2`** <sup><small>(25/Junio/2026)</small></sup>

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

## **`0.10.1`** <sup><small>(25/Junio/2026)</small></sup>

### Resumen

Se corrige el comportamiento de **@jarvis/logger** para respetar **modules.logger.enabled = false** como switch maestro del módulo.

---

### Cambios

- Se agrega soporte efectivo para **enabled** a nivel general del módulo logger.
- Se mantiene **LoggerService** disponible aunque el logger esté apagado.
- Se evita crear transports cuando **modules.logger.enabled** está en **false**.
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

- Se corrige que **modules.logger.enabled = false** no apagara completamente la escritura del logger.
- Se corrige que el logger pudiera seguir escribiendo mensajes de arranque o apagado aunque el módulo estuviera deshabilitado.

---

## **`0.10.0`** <sup><small>(24/Junio/2026)</small></sup>

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

## **`0.9.0`** <sup><small>(24/Junio/2026)</small></sup>

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

## **`0.8.0`** <sup><small>(23/Junio/2026)</small></sup>

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

## **`0.7.1`** <sup><small>(23/Junio/2026)</small></sup>

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

## **`0.7.0`** <sup><small>(23/Junio/2026)</small></sup>

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

## **`0.6.1`** <sup><small>(23/Junio/2026)</small></sup>

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

## **`0.6.0`** <sup><small>(23/Junio/2026)</small></sup>

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

## **`0.5.2`** <sup><small>(22/Junio/2026)</small></sup>

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

## **`0.5.0`** <sup><small>(22/Junio/2026)</small></sup>

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

## **`0.4.0`** <sup><small>(22/Junio/2026)</small></sup>

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

## **`0.3.0`** <sup><small>(22/Junio/2026)</small></sup>

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

## **`0.2.x`** <sup><small>(22/Junio/2026)</small></sup>

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

## **`0.1.0`** <sup><small>(21/Junio/2026)</small></sup>

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
