## Introducción

**`@jarvis/bootstrap`** es el paquete encargado de preparar la configuración inicial de una aplicación **`J.A.R.V.I.S.`** antes de arrancar el runtime.

Este paquete permite centralizar la lectura y normalización de valores iniciales, evitando que **`@jarvis/core`** tenga que encargarse directamente de leer archivos de configuración o preparar datos específicos de una aplicación.

---

## Objetivo

El objetivo de **`@jarvis/bootstrap`** es preparar los valores base que necesita una aplicación antes de iniciar el runtime de **`J.A.R.V.I.S.`**.

Actualmente, este paquete permite:

- Leer **`settings.json`**.
- Crear una instancia de **`ConfigService`**.
- Normalizar datos de la aplicación.
- Normalizar datos del servidor.
- Normalizar la configuración inicial de **`@jarvis/logger`**.
- Normalizar la configuración **`packages.logger.error.verbose`**.
- Entregar un resultado listo para construir módulos y arrancar **`@jarvis/core`**.

---

## Funcionamiento

La función **`createJarvisBootstrap()`** devuelve un objeto con la configuración inicial normalizada:

```ts
{
  app,
  server,
  config,
  logger,
  settings
}
```

Donde:

- **`app`** contiene datos normalizados para **`Jarvis.boot()`**.
- **`server`** contiene datos normalizados para **`Jarvis.boot()`**.
- **`config`** contiene una instancia de **`ConfigService`**.
- **`logger`** contiene opciones normalizadas para **`createLoggerModule()`**.
- **`settings`** contiene el objeto completo cargado desde **`settings.json`**.

---

## Configuración esperada

**`@jarvis/bootstrap`** lee valores desde **`settings.json`** y los normaliza para que la aplicación pueda construir sus módulos reales.

La configuración de paquetes instalables debe vivir bajo:

```txt
packages
```

Ejemplo para logger:

```json
{
  "packages": {
    "logger": {
      "enabled": true,
      "level": "debug",
      "error": {
        "verbose": false
      },
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
```

La sección **`packages.logger`** se transforma en opciones compatibles con **`createLoggerModule()`**.

Regla de lenguaje:

```txt
settings.packages = configuración de paquetes instalables
runtimeModules    = módulos vivos registrados dentro de @jarvis/core
```

**`@jarvis/bootstrap`** no registra módulos vivos directamente. Solo prepara valores para que la aplicación pueda construirlos.

---

## Uso

Ejemplo de uso con **`@jarvis/core`**, **`@jarvis/config`** y **`@jarvis/logger`**:

```ts
const jarvisBootstrap = await createJarvisBootstrap({
  settingsFile: './settings.json'
});

const configModule = createConfigModule({
  values: jarvisBootstrap.settings
});

const loggerModule = createLoggerModule(jarvisBootstrap.logger);

const core = await Jarvis.boot({
  app: jarvisBootstrap.app,
  server: jarvisBootstrap.server,
  runtimeModules: [
    configModule,
    loggerModule
  ]
});
```

---

## Notas

**`@jarvis/bootstrap`** no debe arrancar el runtime directamente.

Su responsabilidad es preparar los valores iniciales para que una aplicación pueda construir sus módulos y después arrancar **`@jarvis/core`** de forma limpia y ordenada.

El flujo esperado es:

```txt
settings.json
↓
@jarvis/bootstrap
↓
@jarvis/config
↓
@jarvis/logger
↓
@jarvis/core
```
