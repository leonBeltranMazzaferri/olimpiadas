# Seleccionar version de Node.js
FROM node:18-alpine

# Declarar workdir
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el codigo
COPY . .

# Exponer el puerto 3000 de la api
EXPOSE 3000

# Iniciar api
CMD ["node", "src/app.js"]
