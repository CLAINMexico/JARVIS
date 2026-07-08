## Introducción

**`@jarvis/core`** es el paquete principal del runtime de **`J.A.R.V.I.S.`**.

Este paquete define las bases centrales para arrancar una instancia de **`J.A.R.V.I.S.`**, registrar módulos, registrar servicios, ejecutar ciclos de vida y exponer información del runtime.

---

## Objetivo

El objetivo de **`@jarvis/core`** es funcionar como el núcleo del ecosistema **`J.A.R.V.I.S.`**.

Este paquete no debe contener lógica específica de configuración, logging, base de datos, seguridad, almacenamiento, licenciamiento o notificaciones. Su responsabilidad es definir las reglas y mecanismos base para que otros paquetes puedan integrarse al runtime.

Actualmente, este paquete permite:

- Arrancar una instancia del runtime mediante **`Jarvis.boot()`**.
- Normalizar opciones iniciales de arranque.
- Registrar módulos informativos.
- Registrar módulos vivos del runtime.
- Registrar servicios expuestos por módulos vivos.
- Consultar servicios mediante **`core.service(name)`**.
- Ejecutar el ciclo de vida inicial de módulos con **`bootModules()`**.
- Ejecutar apagado ordenado con **`shutdown()`**.
- Reportar información de la instancia mediante **`info()`**.
- Exponer contratos base para otros paquetes.

---

## Funcionamiento

El flujo principal de **`@jarvis/core`** se basa en crear una instancia viva de **`J.A.R.V.I.S.`** y ejecutar el ciclo de vida de sus módulos.

El ciclo esperado es:

```txt
Jarvis.boot()
↓
core.bootModules()
↓
core.info()
↓
core.service(name)
↓
core.shutdown()
```

### Arranque del runtime

La función **`Jarvis.boot()`** crea una instancia de **`JarvisApplication`**.

Durante este proceso, el core recibe opciones iniciales como:

- Información de la aplicación.
- Configuración del servidor.
- Módulos informativos.
- Módulos vivos del runtime.

### Módulos informativos

Los módulos informativos registran nombre y estado dentro del runtime.

Estos módulos no ejecutan lógica de arranque o apagado. Sirven para representar capacidades registradas o planeadas dentro de la instancia.

Si un módulo no define **`status`**, **`J.A.R.V.I.S.`** usa el estado:

```txt
registered
```

### Módulos vivos

Los módulos vivos pueden participar en el ciclo de vida del runtime mediante:

- **`boot()`**
- **`shutdown()`**

Los módulos se arrancan en el orden en el que fueron registrados:

```txt
config → logger → database
```

y se apagan en orden inverso:

```txt
database → logger → config
```

### Servicios

Cuando un módulo vivo expone la propiedad **`service`**, **`@jarvis/core`** registra ese valor internamente usando el nombre del módulo como llave.

Regla principal:

```txt
module.name define la llave del servicio.
module.service define el servicio registrado.
core.service(name) recupera el servicio.
```

Contrato base:

```ts
export interface JarvisRuntimeModule {
  name: string;
  service?: unknown;
  boot?(): Promise<void> | void;
  shutdown?(): Promise<void> | void;
}
```

---

## Uso

Ejemplo básico para arrancar una instancia de **`J.A.R.V.I.S.`**:

```ts
import {
  Jarvis
} from '@jarvis/core';

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});

const info = core.info();

console.log(info.name);
console.log(info.app.name);
console.log(info.status);
```

Ejemplo con módulos vivos:

```ts
import {
  Jarvis
} from '@jarvis/core';

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  runtimeModules: [
    {
      name: 'config',
      boot() {
        console.log('[config] boot ejecutado');
      },
      shutdown() {
        console.log('[config] shutdown ejecutado');
      }
    },
    {
      name: 'logger',
      boot() {
        console.log('[logger] boot ejecutado');
      },
      shutdown() {
        console.log('[logger] shutdown ejecutado');
      }
    }
  ]
});

await core.bootModules();

console.log(core.info());

await core.shutdown();
```

Ejemplo con servicios:

```ts
import {
  Jarvis
} from '@jarvis/core';

const configService = {
  get(path: string) {
    return path;
  }
};

const core = await Jarvis.boot({
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: 'local'
  },
  runtimeModules: [
    {
      name: 'config',
      service: configService,
      boot() {
        console.log('[config] boot ejecutado');
      },
      shutdown() {
        console.log('[config] shutdown ejecutado');
      }
    }
  ]
});

await core.bootModules();

const config = core.service<typeof configService>('config');

console.log(config?.get('app.name'));

await core.shutdown();
```

---

## Información del runtime

El método **`core.info()`** devuelve una fotografía normalizada de la instancia viva de **`J.A.R.V.I.S.`**.

Ejemplo:

```json
{
  "name": "J.A.R.V.I.S.",
  "description": "JavaScript Architecture Runtime for Versatile Intelligent Services",
  "app": {
    "name": "Sandbox-API",
    "description": "Ambiente de pruebas para aplicaciones de tipo API.",
    "version": "1.0.0",
    "environment": "local",
    "timeZone": "America/Mexico_City"
  },
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "protocol": "https"
  },
  "modules": [
    {
      "name": "config",
      "status": "registered"
    },
    {
      "name": "logger",
      "status": "registered"
    }
  ],
  "status": "bootstrapped"
}
```

La propiedad **`timeZone`** permite que aplicaciones, logs, procesos internos y futuras tareas programadas conozcan la zona horaria base configurada para la aplicación.

Si no se recibe una zona horaria válida, el core usa:

```txt
UTC
```

### Diferencia entre packages y runtimeModules

En el ecosistema se mantiene esta separación:

```txt
packages       = paquetes físicos/configurables del monorepo
runtimeModules = módulos vivos registrados dentro de @jarvis/core
modules        = módulos reportados por el runtime
```

Ejemplo de paquetes físicos:

```txt
packages/core
packages/config
packages/logger
packages/http
packages/security
```

Ejemplo de configuración:

```txt
settings.packages.logger
```

Ejemplo de módulos vivos:

```ts
runtimeModules: [
  configModule,
  loggerModule
]
```

Por esta razón, contratos como **`JarvisRuntimeModule`**, métodos como **`bootModules()`** y respuestas como **`core.modules()`** conservan el término **`module`**, porque pertenecen al lenguaje interno del runtime.

---

## Notas

**`@jarvis/core`** no debe depender de paquetes concretos como **`@jarvis/config`**, **`@jarvis/logger`**, **`@jarvis/database`** o **`@jarvis/security`**.

Los paquetes concretos sí pueden depender de **`@jarvis/core`** para implementar sus contratos.

Correcto:

```txt
@jarvis/config → @jarvis/core
@jarvis/logger → @jarvis/core
@jarvis/database → @jarvis/core
```

Incorrecto:

```txt
@jarvis/core → @jarvis/config
@jarvis/core → @jarvis/database
```

Esto evita dependencias circulares y mantiene el núcleo limpio.

La relación esperada entre componentes es:

```txt
@jarvis/core = define contratos y mecanismos base
@jarvis/config = implementa un módulo compatible con el core
@jarvis/logger = implementa un módulo compatible con el core
apps/sandbox-api = conecta el core con los módulos reales
```

Regla arquitectónica principal:

```txt
Core define reglas.
Packages implementan reglas.
Apps conectan packages con core.
```

También es importante considerar:

- No meter lógica específica de negocio en **`@jarvis/core`**.
- No leer secretos directamente desde este paquete.
- No acoplar el core a paquetes concretos.
- No romper el contrato **`JarvisRuntimeModule`**.
- Los servicios se registran usando el nombre del módulo como llave.
- Mantener comentarios de documentación en español.
- Mantener commits en español.
