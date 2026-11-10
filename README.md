# Proyecto ISW

Sistema de gestión de inventario de equipos, kits y eventos. Permite registrar equipos, agruparlos en kits, entregar kits a eventos y registrar el estado de cada equipo a la entrega y a la devolución.

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | Node.js + Express 5 (ES Modules) |
| Base de datos | PostgreSQL |
| ORM | Prisma 7 con driver adapter (`@prisma/adapter-pg`) |
| Validación | Zod 4 |
| Autenticación | JWT (`jsonwebtoken`) + `bcrypt` |
| Frontend | React + Vite + Mantine + React Router |

## Estructura del repositorio

```
Proyecto-ISW/
├── server/        # API REST
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/        # se suben a git
│   └── src/
│       ├── config/prisma.js   # instancia única de PrismaClient
│       ├── schemas/           # esquemas Zod
│       ├── services/          # lógica de negocio y acceso a Prisma
│       ├── controllers/       # manejo de request/response
│       ├── routes/            # endpoints de cada recurso
│       ├── middlewares/       # validate, auth y manejo de errores
│       ├── scripts/           # scripts de una sola vez (crear usuario)
│       └── app.js
└── frontend/      # aplicación React
```

## Instalación para desarrollo

### Requisitos

- Node.js 20 o superior
- PostgreSQL instalado y corriendo
- Git
- Recomendado: VS Code con la extensión **REST Client**

### Backend

```bash
git clone <url-del-repositorio>
cd Proyecto-ISW/server
npm install
```

Crea tu archivo de variables de entorno (no se sube a git) y complétalo:

```bash
cp .env.example .env        # en PowerShell: Copy-Item .env.example .env
```

```
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db?schema=public"
PORT=3000
JWT_SECRET=pega_aqui_un_valor_aleatorio
JWT_EXPIRES_IN=8h
```

Genera tu propio `JWT_SECRET` (cada persona usa uno distinto en su entorno):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Crea la base de datos vacía, aplica las migraciones y levanta el servidor:

```bash
createdb nombre_db              # o desde pgAdmin / psql
npx prisma migrate dev          # crea las tablas y genera el cliente de Prisma
npm run dev
```

El servidor queda en `http://localhost:3000`.

### Crear el primer usuario

El login funciona con correo y contraseña, y todavía no hay un endpoint abierto para crear usuarios. Usa el script, ejecutándolo **desde la carpeta `server`** (para que encuentre el `.env`):

```bash
node src/scripts/crearUsuario.js admin@correo.com tu_contraseña
```

El usuario se crea con el privilegio de supervisor.

### Frontend

```bash
cd frontend
npm install
```

Crea `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

La aplicación abre en `http://localhost:5173`.

## Cómo está construido un endpoint

Cada recurso (`equipos`, `kits`, `eventos`, `asignaciones`, `auth`) repite el mismo patrón de cuatro archivos. Para agregar uno nuevo, copia la estructura de `equipos` y sigue este flujo:

```
Ruta → autenticar / requierePrivilegio → validate (Zod) → Controller → Service (Prisma) → BD
                                                              ↓ (si hay error)
                                                       next(error) → errorHandler
```

### 1. Schema (Zod) — `src/schemas/ejemplo.schema.js`

Define la forma de los datos. En Zod 4, los mensajes personalizados van como `{ error: '...' }`.

```javascript
import { z } from 'zod';

export const crearEjemploSchema = z.object({
  nombre: z.string().min(1, { error: 'El nombre es requerido' }),
  cantidad: z.number().int().positive({ error: 'Debe ser mayor a 0' }),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive({ error: 'El id debe ser un número válido' }),
});
```

### 2. Service — `src/services/ejemplo.service.js`

Es el único lugar que habla con Prisma. Si una operación escribe en varias tablas, va dentro de `prisma.$transaction`. Para reglas de negocio, lanza un error con un `code` propio.

```javascript
import prisma from '../config/prisma.js';

export async function crearEjemplo(data) {
  return prisma.ejemplo.create({ data });
}

export async function obtenerEjemplo({ id }) {
  const ejemplo = await prisma.ejemplo.findUnique({ where: { id } });
  if (!ejemplo) {
    const error = new Error('El ejemplo no existe');
    error.code = 'EJEMPLO_NOT_FOUND';
    throw error;
  }
  return ejemplo;
}
```

### 3. Controller — `src/controllers/ejemplo.controller.js`

Solo traduce HTTP: llama al service, responde con el status correcto y pasa los errores a `next`. Nunca importa Prisma.

```javascript
import * as ejemploService from '../services/ejemplo.service.js';

export async function crearEjemplo(req, res, next) {
  try {
    const ejemplo = await ejemploService.crearEjemplo(req.body);
    return res.status(201).json(ejemplo);
  } catch (error) {
    if (error.code === 'EJEMPLO_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}
```

### 4. Route — `src/routes/ejemplo.routes.js`

```javascript
import { Router } from 'express';
import { crearEjemplo } from '../controllers/ejemplo.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { requierePrivilegio } from '../middlewares/auth.middleware.js';
import { crearEjemploSchema } from '../schemas/ejemplo.schema.js';

const router = Router();

router.post('/', requierePrivilegio('INVENTARIO'), validate(crearEjemploSchema), crearEjemplo);

export default router;
```

Luego móntala en `app.js`, **después** de `app.use(autenticar)` para que exija sesión:

```javascript
app.use('/ejemplos', ejemploRoutes);
```

### Reglas del patrón

- `validate(schema, target)` valida `body` (por defecto), `params` o `query`, y reemplaza `req[target]` con los datos ya validados.
- Los errores de Prisma (`P2002`, `P2003`, `P2025`) los traduce a 409, 400 y 404 el middleware `error.middleware.js`. No hace falta manejarlos en el controller.
- Los errores de reglas de negocio llevan un `code` propio y el controller los mapea a 404 o 409.
- Los middlewares `async` pueden lanzar errores sin `try/catch`: Express 5 los envía al `errorHandler`.

## Autenticación y privilegios

- `POST /auth/login` recibe `email` y `password` y devuelve un `token` JWT.
- El resto de la API exige el header `Authorization: Bearer <token>`.
- Cada usuario tiene tres privilegios independientes (`rolContador`, `rolInventario`, `rolSupervisor`), con cero, uno o más activos. El supervisor tiene acceso a todo.
- `autenticar` verifica el token y consulta la base de datos en cada petición, así desactivar una cuenta o cambiar privilegios surte efecto de inmediato.
- `requierePrivilegio('CONTADOR', 'INVENTARIO')` deja pasar a quien tenga al menos uno de los privilegios indicados.

## Trabajo con Prisma en equipo

La estructura de la base de datos se define **solo** en `prisma/schema.prisma` y se aplica con migraciones. Nunca modifiques tablas a mano.

```bash
git pull
npx prisma migrate dev                                  # aplica las migraciones del equipo primero
# edita schema.prisma
npx prisma migrate dev --name describe_tu_cambio        # crea y aplica la tuya
```

| Comando | Dónde | Qué hace |
| --- | --- | --- |
| `prisma migrate dev` | Tu máquina | Crea y aplica migraciones. |
| `prisma migrate deploy` | Servidor | Solo aplica migraciones pendientes. **Nunca uses `migrate dev` en el servidor.** |
| `prisma migrate reset` | Tu máquina | Borra la base local y reaplica todo. Úsalo si aparece un error de drift. |
| `prisma generate` | Cualquiera | Regenera el cliente. Corre esto si ves `does not provide an export named 'PrismaClient'` o `prisma.<modelo> is undefined`. |

Sube siempre la carpeta `prisma/migrations/` en tu commit.

## Flujo de trabajo con Git

1. Parte de `main` actualizado: `git checkout main && git pull`.
2. Haz commits con mensajes descriptivos y subelos a tu rama.
3. Abre un Pull Request hacia `main` y pide revisión. No se trabaja directo sobre `main`.
4. Antes de seguir trabajando varios días, trae los cambios de `main` a tu rama con `git merge main`.

Si hay conflictos en `schema.prisma`, revisen el resultado entre las personas involucradas: campos obligatorios duplicados o relaciones repetidas son lo más común.
