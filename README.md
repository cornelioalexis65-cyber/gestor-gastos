# Gestor de Gastos

Aplicación web para control de finanzas personales, construida como parte de una ruta de aprendizaje de desarrollo de software.

## Características

- **Dashboard**: Balance actual, ingresos/gastos totales, movimientos recientes
- **Ingresos**: CRUD completo con filtrado por fecha y categoría
- **Gastos**: CRUD completo con soporte para efectivo, débito y tarjeta de crédito
- **Categorías**: Organización de movimientos (ingresos/gastos/ambos)
- **Tarjetas de crédito**: Administración con cálculo de crédito disponible
- **Pagos de tarjeta**: Registro de pagos con actualización automática de saldo
- **Reportes**: Estadísticas por categoría, balance mensual (próximamente gráficas)

## Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite 5
- React Router 6
- date-fns, lucide-react, zod

### Backend
- Node.js + TypeScript
- Express 4
- @libsql/client (Turso)
- helmet, express-rate-limit, express-validator, zod

### Base de Datos
- Turso (libSQL/SQLite)
- Esquema relacional con integridad referencial

## Estructura del Proyecto

```
gestor-gastos/
├── frontend/          # React + Vite + TS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── styles/
│   └── package.json
├── backend/           # Express + TS
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database/
│   │   ├── middleware/
│   │   └── models/
│   └── package.json
├── database/          # SQL Schema + Migraciones
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
├── .env.example
├── .gitignore
└── package.json       # Monorepo root
```

## Instalación

### Prerrequisitos
- Node.js 20+
- Cuenta en [Turso](https://turso.tech) (gratuita)

### Configuración

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd gestor-gastos
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales de Turso
```

4. Crear base de datos local para desarrollo (opcional):
```bash
# En backend/.env, usar:
# TURSO_DATABASE_URL=file:./local.db
```

5. Ejecutar migraciones y seeds:
```bash
npm run db:migrate
npm run db:seed
```

## Desarrollo

### Ejecutar todo (frontend + backend):
```bash
npm run dev
```

### Ejecutar por separado:
```bash
# Frontend (puerto 5173)
npm run dev:frontend

# Backend (puerto 3000)
npm run dev:backend
```

### Comandos útiles:
```bash
# Build producción
npm run build

# Lint
npm run lint

# Migraciones DB
npm run db:migrate
npm run db:seed
```

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `PORT` | Puerto del backend (default: 3000) | No |
| `NODE_ENV` | Entorno (development/production) | No |
| `TURSO_DATABASE_URL` | URL de la base de datos Turso | Sí |
| `TURSO_AUTH_TOKEN` | Token de autenticación Turso | Sí |
| `CORS_ORIGIN` | Origen del frontend (default: http://localhost:5173) | No |
| `VITE_API_URL` | URL de la API para frontend | Sí |

## Base de Datos

### Tablas Principales

- **categorias**: Organización de movimientos
- **ingresos**: Registro de ingresos
- **gastos**: Registro de gastos (con soporte tarjeta)
- **tarjetas**: Tarjetas de crédito
- **pagos_tarjeta**: Pagos a tarjetas

### Integridad Referencial
- Categorías: `ON DELETE RESTRICT` (no borrar si hay movimientos)
- Gastos→Tarjetas: `ON DELETE SET NULL` (gasto queda como efectivo)
- Pagos→Tarjetas: `ON DELETE CASCADE` (borrar tarjeta borra pagos)

## API Endpoints

### Categorías
```
GET    /api/categorias
POST   /api/categorias
GET    /api/categorias/:id
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

### Ingresos
```
GET    /api/ingresos
POST   /api/ingresos
GET    /api/ingresos/:id
PUT    /api/ingresos/:id
DELETE /api/ingresos/:id
```

### Gastos
```
GET    /api/gastos
POST   /api/gastos
GET    /api/gastos/:id
PUT    /api/gastos/:id
DELETE /api/gastos/:id
```

### Tarjetas
```
GET    /api/tarjetas
POST   /api/tarjetas
GET    /api/tarjetas/:id
PUT    /api/tarjetas/:id
DELETE /api/tarjetas/:id
```

### Pagos
```
GET    /api/tarjetas/:id/pagos
POST   /api/tarjetas/:id/pagos
```

### Dashboard
```
GET    /api/dashboard/summary
GET    /api/dashboard/stats
```

## Seguridad

- Helmet.js para headers HTTP seguros
- Rate limiting (100 req/15min general, 30 req/min mutaciones)
- CORS configurado solo para origen conocido
- Validación de entrada con Zod
- Prepared statements (prevención SQL injection)
- Variables de entorno para secretos (nunca en código)

## Fases de Desarrollo

1. ✅ **Fase 1** - Preparación (monorepo, configuración, estructura)
2. 🔄 **Fase 2** - Base de datos (esquema, migraciones, seeds)
3. ⏳ **Fase 3** - CRUD Categorías
4. ⏳ **Fase 4** - CRUD Ingresos
5. ⏳ **Fase 5** - CRUD Gastos
6. ⏳ **Fase 6** - CRUD Tarjetas
7. ⏳ **Fase 7** - CRUD Pagos
8. ⏳ **Fase 8** - Dashboard
9. ⏳ **Fase 9** - UI/UX
10. ⏳ **Fase 10** - Reportes y Gráficas

## Licencia

MIT - Proyecto educativo