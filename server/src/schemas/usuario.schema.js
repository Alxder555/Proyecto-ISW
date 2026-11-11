import { z } from 'zod';
const email = z.string().trim().toLowerCase().pipe(z.email({ error: 'Correo inválido' }));
const password = z.string({ error: 'La contraseña es requerida' }).min(8, { error: 'La contraseña debe tener al menos 8 caracteres' })
    .refine((v) => Buffer.byteLength(v, 'utf8') <= 72, { error: 'La contraseña es demasiado larga' });

export const crearUsuarioSchema = z.object({
    email,
    password,
    rolContador: z.boolean().default(false),
    rolInventario: z.boolean().default(false),
    rolSupervisor: z.boolean().default(false),
    rolAdministrador: z.boolean().default(false),
});
export const cambiarPasswordSchema = z.object({ password });

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive({ error: 'El id debe ser un numero válido' }),
});