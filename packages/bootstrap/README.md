## @jarvis/bootstrap

**`@jarvis/bootstrap`** es el package encargado de preparar la configuración inicial de una aplicación **`J.A.R.V.I.S.`** antes de arrancar el runtime.

---

## Logger

**`@jarvis/bootstrap`** normaliza la configuración inicial de **`@jarvis/logger`** desde **`settings.json`**.

Esto permite crear el módulo logger de forma directa:

```ts
const loggerModule = createLoggerModule(jarvisBootstrap.logger);
```

Valores normalizados:

- **`enabled`**
- **`appName`**
- **`level`**
- **`defaultModule`**
- **`timeZone`**
- **`console`**
- **`file`**

---

## Switch maestro de logger

El valor:

```txt
modules.logger.enabled
```

se entrega a **`@jarvis/logger`** como **`enabled`**.

Cuando es **`false`**, **`@jarvis/logger`** conserva el servicio disponible pero no escribe en consola ni archivos.

Esto permite que otros packages puedan usar:

```ts
core.service('logger')
```

sin romper flujo, incluso cuando el logger este apagado por configuración.

---

## Resultado del bootstrap

**`createJarvisBootstrap()`** devuelve:

```ts
{
  settings,
  config,
  app,
  server,
  logger
}
```

Donde:

- **`settings`** contiene el objeto completo cargado desde **`settings.json`**.
- **`config`** contiene una instancia de **`ConfigService`**.
- **`app`** contiene datos normalizados para **`Jarvis.boot()`**.
- **`server`** contiene datos normalizados para **`Jarvis.boot()`**.
- **`logger`** contiene opciones normalizadas para **`createLoggerModule()`**.

---

## Uso con @jarvis/core, @jarvis/config y @jarvis/logger

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

## Estado actual

Actualmente **`@jarvis/bootstrap`** ya puede:

- Leer **`settings.json`**.
- Crear **`ConfigService`**.
- Normalizar datos de app.
- Normalizar datos de server.
- Normalizar datos de logger.
- Entregar **`logger.enabled`** como switch maestro.
- Devolver un **`BootstrapResult`**.
- Ser consumido desde **`apps/sandbox-api`** para preparar config y logger.
