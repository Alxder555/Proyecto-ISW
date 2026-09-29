import {z} from 'zod';

export const crearEquipoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  estado: z.enum(['BUEN_ESTADO', 'DANADO', 'PERDIDO']).optional(),
  kitId: z.number().int().positive().optional(),
});