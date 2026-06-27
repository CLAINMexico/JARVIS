# Certificados locales

## Introducción

Esta carpeta está reservada para certificados locales usados por **`Sandbox-API`** durante pruebas HTTPS.

Los certificados permiten validar el arranque de **`J.A.R.V.I.S.`** usando un canal seguro en ambientes locales o controlados, sin depender de certificados productivos.

---

## Objetivo

El objetivo de esta carpeta es proporcionar una ubicación estándar para los archivos requeridos por la configuración HTTPS de **`Sandbox-API`**.

Archivos esperados en desarrollo local:

```txt
apps/sandbox-api/certs/local.key
apps/sandbox-api/certs/local.crt
```

Estos archivos deben ser generados por cada desarrollador en su propio entorno.

---

## Funcionamiento

**`Sandbox-API`** puede leer certificados locales cuando la configuración de **`settings.json`** habilita HTTPS.

Ejemplo de configuración:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "protocol": "https",
    "https": {
      "enabled": true,
      "keyFile": "./certs/local.key",
      "certFile": "./certs/local.crt"
    }
  }
}
```

Cuando HTTPS está activo, el servidor carga:

```txt
keyFile  -> llave privada local
certFile -> certificado local
```

Estos archivos son usados únicamente para crear el servidor HTTPS de pruebas.

---

## Uso

Para generar un certificado autofirmado local, ejecutar desde la raíz del proyecto:

```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout apps/sandbox-api/certs/local.key \
  -out apps/sandbox-api/certs/local.crt \
  -days 365 \
  -subj "/C=MX/ST=CDMX/L=CDMX/O=CLAIN Mexico/OU=JARVIS Sandbox-API/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Esto generará:

```txt
apps/sandbox-api/certs/local.key
apps/sandbox-api/certs/local.crt
```

El certificado incluirá información descriptiva dentro del subject:

```txt
C  = MX
ST = CDMX
L  = CDMX
O  = CLAIN Mexico
OU = JARVIS Sandbox-API
CN = localhost
```

Y también incluirá nombres alternativos válidos para pruebas locales:

```txt
DNS:localhost
IP:127.0.0.1
```

Después de generarlos, **`Sandbox-API`** podrá arrancar en HTTPS si **`settings.json`** tiene habilitado:

```json
{
  "protocol": "https",
  "https": {
    "enabled": true
  }
}
```

---

## Notas

Los certificados y llaves privadas locales no deben publicarse en el repositorio.

El archivo **`.gitignore`** raíz ignora extensiones comunes de certificados y llaves privadas dentro de esta carpeta:

```txt
*.key
*.crt
*.pem
*.p12
*.pfx
```

Esta carpeta puede mantenerse versionada usando únicamente archivos seguros como:

```txt
.gitkeep
README.md
```

Los certificados generados son únicamente para desarrollo local o pruebas controladas.

No deben compartirse, publicarse ni reutilizarse en ambientes productivos o servidores compartidos.

Aunque el certificado incluya información como organización, unidad o nombre común, sigue siendo un certificado autofirmado. Por eso, navegadores y herramientas HTTP pueden mostrar advertencias de confianza.
