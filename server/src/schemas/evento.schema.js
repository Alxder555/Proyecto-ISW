import { z } from 'zod';
export const crearEventoSchema = z.object({
  nombre: z.string().min(1, { error: 'El nombre del evento es requerido' }),
  cliente: z.string().optional(),
  ubicacion: z.string().min(1, { error: 'La ubicación es requerida' }),
  fechaInicio: z.coerce.date({ error: 'La fecha de inicio es requerida' }),
  fechaFin: z.coerce.date().optional(),
  estado: z.string().optional(),
  operadoresIds: z.array(z.number().int().positive()).optional(),
  kitsIds: z.array(z.number().int().positive()).optional(),
});


export const idParamSchema = z.object({
  id: z.coerce.number().int().positive({ error: 'El id debe ser un número válido' }),
});