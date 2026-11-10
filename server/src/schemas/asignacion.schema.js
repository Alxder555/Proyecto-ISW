import { z } from 'zod';

const ESTADOS_EQUIPO = ['BUEN_ESTADO', 'DANADO', 'PERDIDO'];

const detalleEquipoSchema = z.object({
    equipoId: z.number().int().positive(),
    estadoEntrega: z.enum(ESTADOS_EQUIPO),
    observaciones: z.string().optional(),
});

export const crearAsignacionSchema = z.object({
    trabajoId: z.number().int().positive('El id del trabajo es requerido'),
    kitId: z.number().int().positive('El id del kit es requerido'),
    detalles: z.array(detalleEquipoSchema).min(1, { error: 'Debes especificar el estado de al menos un equipo' }),
});

const detalleDevolucionSchema = z.object({
    equipoId: z.number().int().positive(),
    estadoDevolucion: z.enum(ESTADOS_EQUIPO),
    observaciones: z.string().optional(),
})

export const registrarDevolucionSchema = z.object({
    detalles: z.array(detalleDevolucionSchema).min(1, { error: 'Debes especificar el estado de devolución de al menos un equipo' }),
});

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive('El id debe ser un numero valido'),
});