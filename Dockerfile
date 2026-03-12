FROM node:20-alpine

# Instalamos dependencias de sistema necesarias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 1. Habilitamos Corepack para que maneje Yarn 4 automáticamente
RUN corepack enable

# 2. Copiamos los archivos de definición (el asterisco evita que falle si no existen)
COPY package.json yarn.lock* .yarnrc.yml* ./

# 3. Instalamos las dependencias
RUN yarn install

# 4. Copiamos el resto del código (tu .dockerignore evitará copiar basura)
COPY . .

# 5. Compilamos TypeScript a JavaScript
RUN yarn build

EXPOSE 3000

# 6. Arrancamos el servidor
CMD ["node", "dist/index.js"]