## Introducción

**`@jarvis/config`** es el paquete de configuración del ecosistema **`J.A.R.V.I.S.`**.

Este paquete permite cargar, almacenar y consultar configuración para aplicaciones construidas sobre el runtime de **`J.A.R.V.I.S.`**.

---

## Objetivo

El objetivo de **`@jarvis/config`** es centralizar la configuración de una aplicación y exponerla mediante un servicio reutilizable.

Este paquete está pensado para separar claramente la configuración no sensible de los valores sensibles:

```txt
settings.json = configuración no sensible y referencias
.env = secretos reales y valores sensibles
```

En palabras simples:

```txt
@jarvis/config lee la configuración de la aplicación.
ConfigService permite consultarla.
@jarvis/core monta el módulo durante el arranque.
```

Actualmente, este paquete permite:

- Crear un módulo compatible con **`JarvisRuntimeModule`**.
- Cargar configuración desde un objeto directo.
- Cargar configuración desde un archivo **`settings.json`**.
- Guardar la configuración dentro de **`ConfigService`**.
- Consultar valores mediante paths separados por punto.
- Exponer la configuración completa cuando sea necesario.
- Participar en el ciclo de vida del runtime mediante **`boot()`** y **`shutdown()`**.

---

## Funcionamiento

**`@jarvis/config`** se integra al runtime mediante la función **`createConfigModule()`**, la cual crea un módulo compatible con **`@jarvis/core`**.

Este módulo puede recibir configuración de dos formas:

```ts
createConfigModule({
  values: {
    app: {
      name: 'MyApp'
    }
  }
});
```

o desde un archivo:

```ts
createConfigModule({
  file: './settings.json'
});
```

Durante el arranque, el módulo carga la configuración y la guarda dentro de una instancia de **`ConfigService`**.

El servicio principal expone tres operaciones base:

```ts
config.load(values);
config.get('app.name');
config.all();
```

### Lectura por path

**`ConfigService.get()`** permite leer valores usando paths separados por punto:

```ts
config.get('app.name');
config.get('server.port');
config.get('database.connections.main.driver');
config.get('packages.logger.enabled');
```

Si el path no existe, devuelve:

```txt
undefined
```

### Ciclo de vida

Durante **`boot()`**, el módulo:

- Lee **`settings.json`** si se definió **`file`**.
- Parsea el archivo.
- Carga los valores dentro de **`ConfigService`**.
- Deja la configuración lista para consulta.

Durante **`shutdown()`**, el módulo ejecuta su apagado para mantener compatibilidad con el ciclo de vida del runtime.

Actualmente, **`@jarvis/config`** lee el archivo de configuración una sola vez durante **`boot()`**. Si **`settings.json`** cambia mientras la aplicación está corriendo, los cambios no se aplican automáticamente.

Para aplicar cambios, se debe reiniciar la aplicación.

---

## Placeholders y variables de entorno

**`@jarvis/config`** puede almacenar valores que funcionan como referencias a variables de entorno.

Ejemplo en **`settings.json`**:

```json
{
  "api": {
    "jwt": {
      "secret": "SETTINGS_SECURITY_JWT_SECRET"
    }
  }
}
```

Ejemplo en **`.env`**:

```env
SETTINGS_SECURITY_JWT_SECRET=JARVIS_LOCAL_SECURITY_SECRET
```

El servicio **`ConfigService`** devuelve el valor configurado en **`settings.json`**. La resolución del placeholder contra **`process.env`** puede realizarse en la aplicación o en el paquete que consume la configuración.

Esto permite mantener una separación clara:

```txt
settings.json = estructura y referencias
.env          = valores sensibles reales
```

### Configuración por packages

La configuración de paquetes instalables debe declararse bajo:

```txt
packages
```

Ejemplo:

```ts
config.get('packages.logger.enabled');
config.get('packages.logger.error.verbose');
config.get('api.jwt.secret');
```

El término **`packages`** representa configuración de paquetes físicos del monorepo. No debe confundirse con **`runtimeModules`**, que representa módulos vivos registrados dentro de **`@jarvis/core`**.

---

## Uso

Ejemplo básico con valores directos:

```ts
import {
  createConfigModule
} from '@jarvis/config';

const configModule = createConfigModule({
  values: {
    app: {
      name: 'MyApp',
      version: '1.0.0',
      environment: 'local'
    },
    server: {
      host: '0.0.0.0',
      port: 3000
    }
  }
});

await configModule.boot?.();

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await configModule.shutdown?.();
```

Ejemplo con **`settings.json`**:

```ts
import {
  createConfigModule
} from '@jarvis/config';

const configModule = createConfigModule({
  file: './settings.json'
});

await configModule.boot?.();

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await configModule.shutdown?.();
```

Ejemplo integrado con **`@jarvis/core`**:

```ts
import {
  Jarvis
} from '@jarvis/core';

import {
  createConfigModule
} from '@jarvis/config';

const configModule = createConfigModule({
  file: './settings.json'
});

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeModules: [
    configModule
  ]
});

await core.bootModules();

const config = core.service('config');

console.log(configModule.service.get('app.name'));
console.log(configModule.service.get('server.port'));

await core.shutdown();
```

Ejemplo usando **`ConfigService`** directamente:

```ts
import {
  ConfigService
} from '@jarvis/config';

const config = new ConfigService({
  app: {
    name: 'MyApp'
  },
  server: {
    port: 3000
  }
});

console.log(config.get('app.name'));
console.log(config.get('server.port'));
console.log(config.all());
```

---

## Notas

**`settings.json`** representa la configuración local o real de una aplicación, pero no debe guardar secretos reales.

En vez de guardar valores sensibles directamente:

```json
{
  "database": {
    "password": "PasswordReal"
  }
}
```

se debe usar una referencia:

```json
{
  "database": {
    "passwordRef": "SETTINGS_DATABASE_PASSWORD"
  }
}
```

y el valor real debe vivir en **`.env`**:

```env
SETTINGS_DATABASE_PASSWORD=
```

Regla principal:

```txt
settings.json = configuración y referencias
.env = secretos reales
```

**`settings.example.json`** debe servir como referencia versionable de configuración y puede subirse a Git porque no debe contener secretos reales.

Este paquete no debe encargarse directamente de:

- Conectarse a bases de datos.
- Validar licencias.
- Firmar o validar JWT.
- Enviar correos o notificaciones.
- Crear servidores HTTP.
- Implementar lógica de negocio.
- Guardar secretos reales dentro de **`settings.json`**.

**`@jarvis/config`** depende de **`@jarvis/core`** para implementar **`JarvisRuntimeModule`**.

Relación correcta:

```txt
@jarvis/config → @jarvis/core
```

Relación incorrecta:

```txt
@jarvis/core → @jarvis/config
```

Esto evita dependencias circulares y mantiene el core limpio.

También es importante considerar:

- No subir **`settings.json`** real a Git.
- Mantener **`settings.example.json`** como referencia segura.
- Mantener **`.env`** fuera de Git.
- Mantener **`.env.example`** como plantilla segura.
- No acoplar **`@jarvis/core`** a **`@jarvis/config`**.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
