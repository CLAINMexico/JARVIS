# Versión de Node.js
FROM node:22-alpine

# Versión del Dockerfile
ENV DOCKERFILE_VERSION=1.0.0

# Espacio de Trabajo
WORKDIR /workspace

# Instalación de Dependencias y Herramientas
RUN apk add --no-cache \
  bash \
  git \
  openssl \
  libc6-compat

RUN corepack enable && corepack prepare pnpm@11.8.0 --activate

COPY package.json pnpm-workspace.yaml ./

CMD ["sh"]
