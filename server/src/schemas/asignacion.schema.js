import { z } from 'zod';

const detalleEquipoSchema = z.object({
    equipoId: z.number().int().positive(),
    estadoEntrega: z.enum(['BUEN_ESTADO', 'DANADO', 'PERDIDO']),
    observaciones: z.string().optional(),
});

export const crearAsignacionSchema = z.object({
    trabajoId: z.number().int().positive('El id del trabajo es requerido'),
    kitId: z.number().int().positive('El id del kit es requerido'),
    detalles: z.array(detalleEquipoSchema).min('Debes especificar el estado de al menos un equipo'),
});