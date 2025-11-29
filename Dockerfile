# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Generar Prisma Client en producción
RUN npx prisma generate

# Copiar el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
