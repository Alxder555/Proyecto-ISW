import { z } from 'zod';

export const gastoSchema = z.object({
    eventoId: z.number().int().positive(),
    tipo: z.enum(['REMUNERACION', 'MOVILIZACION', 'PEAJE', 'OTRO']),
    monto: z.number().positive(),
    fecha: z.coerce.date().optional(),
    puntoSalida: z.string().optional(),
    puntoLlegada: z.string().optional(),
    comprobante: z.string().optional(),
    observacion: z.string().optional(),
});