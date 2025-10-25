# 🧠 Consultorio Psicológico - Backend API

Backend desarrollado en NestJS para el sistema de gestión de consultorio psicológico. Proporciona una API REST segura con autenticación JWT y conexión a base de datos PostgreSQL en Supabase.

## 🚀 Tecnologías

- **NestJS** v11 - Framework Node.js progresivo
- **TypeScript** v5.7 - Tipado estático
- **Prisma** v6.18 - ORM para PostgreSQL
- **PostgreSQL** - Base de datos (Supabase)
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **Passport** - Estrategias de autenticación
- **class-validator** - Validación de DTOs

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (para la base de datos PostgreSQL)

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
```

**Cómo obtener las credenciales de Supabase:**

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Database**
4. Copia el **Connection string** en modo "Transaction" (puerto 6543) para `DATABASE_URL`
5. Copia el **Connection string** en modo "Session" (puerto 5432) para `DIRECT_URL`
6. Reemplaza `[YOUR-PASSWORD]` con tu contraseña de base de datos

### 3. Crear las tablas en la base de datos

Opción 1: Usar el script automatizado (recomendado)

```bash
npm run db:setup
```

Opción 2: Ejecutar manualmente en Supabase SQL Editor

Ve a tu proyecto en Supabase > SQL Editor y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON users;

CREATE POLICY "Enable all operations for authenticated users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 4. Generar el cliente de Prisma

```bash
npm run prisma:generate
```

## 🏃 Ejecución

### Desarrollo (con hot-reload)

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3001/api`

### Producción

```bash
# Compilar el proyecto
npm run build

# Ejecutar en modo producción
npm run start:prod
```

### Modo debug

```bash
npm run start:debug
```

## 📡 Endpoints de la API

### Base URL
```
http://localhost:3001/api
```

### Autenticación

#### Registrar nuevo usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

**Respuesta exitosa (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "f4bd69c3-77fc-4918-8e3a-7c99de96a63e",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "created_at": "2025-10-25T20:30:43.513Z"
  }
}
```

#### Iniciar sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "f4bd69c3-77fc-4918-8e3a-7c99de96a63e",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "created_at": "2025-10-25T20:30:43.513Z"
  }
}
```

#### Validar token
```http
GET /auth/validate
Authorization: Bearer <access_token>
```

**Respuesta exitosa (200):**
```json
{
  "valid": true,
  "user": {
    "id": "f4bd69c3-77fc-4918-8e3a-7c99de96a63e",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "created_at": "2025-10-25T20:30:43.513Z"
  }
}
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📦 Scripts disponibles

```bash
npm run build          # Compilar el proyecto
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo (hot-reload)
npm run start:debug    # Iniciar en modo debug
npm run lint           # Ejecutar ESLint
npm run format         # Formatear código con Prettier
npm run test           # Ejecutar tests unitarios
npm run test:e2e       # Ejecutar tests end-to-end
npm run test:cov       # Generar reporte de cobertura
npm run db:setup       # Crear tablas en la base de datos
npm run prisma:generate # Generar cliente de Prisma
```

## 🗂️ Estructura del Proyecto

```
consultorio-backend/
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
├── scripts/
│   └── setup-database.ts    # Script para crear tablas
├── src/
│   ├── auth/               # Módulo de autenticación
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # Guards de NestJS
│   │   ├── interfaces/    # Interfaces TypeScript
│   │   ├── strategies/    # Estrategias de Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── prisma/            # Módulo de Prisma
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts            # Punto de entrada
├── test/                  # Tests e2e
├── .env                   # Variables de entorno (no commitear)
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Seguridad

### Validación de Datos
Todos los endpoints validan los datos de entrada usando `class-validator` y DTOs.

### Hash de Contraseñas
Las contraseñas se hashean con bcrypt (10 rounds) antes de guardarse en la base de datos.

### Autenticación JWT
- Los tokens expiran después de 7 días (configurable)
- Los endpoints protegidos requieren token JWT válido
- El token se envía en el header `Authorization: Bearer <token>`

### CORS
Configurado para aceptar requests desde:
- `http://localhost:3000` (frontend Next.js)
- `http://localhost:3001` (mismo origen)

### Variables de Entorno
Las credenciales sensibles se cargan desde `.env` (excluido de git).

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Problema:** No se puede conectar a Supabase PostgreSQL.

**Solución:**
1. Verifica que las credenciales en `.env` sean correctas
2. Asegúrate de usar el host correcto (verifica en Supabase Dashboard)
3. Comprueba que tu IP no esté bloqueada por firewall
4. Verifica la contraseña de la base de datos

### Error: "JWT_SECRET must be provided"

**Problema:** Falta la variable `JWT_SECRET` en `.env`.

**Solución:**
Agrega una clave secreta fuerte en tu archivo `.env`:
```env
JWT_SECRET=tu_clave_secreta_super_segura_y_larga
```

### Error: "Table 'users' doesn't exist"

**Problema:** La tabla de usuarios no está creada en la base de datos.

**Solución:**
```bash
npm run db:setup
```

O ejecuta el SQL manualmente en Supabase SQL Editor (ver sección de instalación).

## 📝 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👨‍💻 Desarrollado con

- NestJS CLI
- Prisma CLI
- TypeScript
- Supabase

---

**Nota:** Este es un proyecto educativo para gestión de consultorio psicológico. No compartir credenciales de producción.
