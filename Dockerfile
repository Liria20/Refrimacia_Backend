FROM node:20-alpine

# Instalamos dependencias de sistema necesarias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 1. Copiamos los archivos de definición (package.json y package-lock.json)
COPY package.json package-lock.json* ./

# 2. Instalamos las dependencias usando npm
RUN npm install

# 3. Copiamos el resto del código (tu .dockerignore evitará copiar basura)
COPY . .

# 4. Compilamos TypeScript a JavaScript
RUN npm run build

EXPOSE 3000

# 5. Arrancamos el servidor
CMD ["node", "dist/index.js"]