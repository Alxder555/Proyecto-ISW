import { Router } from 'express';
import {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  asignarOperadoresAEvento,
  eliminarEvento,
} from '../controllers/evento.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { crearEventoSchema } from '../schemas/evento.schema.js';
import { requierePrivilegio } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requierePrivilegio('INVENTARIO', 'ADMINISTRADOR'))

router.get('/', obtenerEventos);
router.get('/:id', obtenerEventoPorId);
router.post('/', validate(crearEventoSchema),crearEvento);
router.put('/:id', actualizarEvento);
router.post('/:id/operadores', asignarOperadoresAEvento);
router.delete('/:id', eliminarEvento);




export default router;