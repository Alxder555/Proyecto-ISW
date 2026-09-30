import { z } from 'zod';
export const crearTrabajoSchema = z.object({
    nombre: z.string().min(1, { error: 'El nombre del trabajo es requerido' }),
    cliente: z.string().optional(),
    fechaInicio: z.coerce.date({ error: 'La fecha de inicio es requerida' }),
    fechaFin: z.coerce.date().optional(),
});