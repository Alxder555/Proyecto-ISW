import { z } from 'zod';

export const crearKitSchema = z.object({
    nombre: z.string().min(1, { error: 'El nombre del kit es requerido' }),
});

export const asignarEquipoSchema = z.object({
    equipoId: z.number().int().positive('El id del equipo es requerido'),
    motivo: z.string().optional(),
});

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive('El id debe ser un numero valido'),
});