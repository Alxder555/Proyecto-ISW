import { Router } from 'express';
import {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  asignarOperadoresAEvento,
  eliminarEvento,
} from '../controllers/eventoController.js';

const router = Router();

router.get('/', obtenerEventos);
router.get('/:id', obtenerEventoPorId);
router.post('/', crearEvento);
router.put('/:id', actualizarEvento);
router.post('/:id/operadores', asignarOperadoresAEvento);
router.delete('/:id', eliminarEvento);

export default router;