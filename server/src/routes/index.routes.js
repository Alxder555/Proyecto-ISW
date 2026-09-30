import { Router } from "express";
import equipoRoutes from './equipo.routes.js'
import kitRoutes from './kit.routes.js'
import asignacionRoutes from './asignacion.routes.js'
import gastoRoutes from './gasto.routes.js';
import { obtenerRentabilidad } from '../controllers/evento.controller.js';
import eventoRoutes from './evento.routes.js';

const router = Router();

router.use('/equipo', equipoRoutes);
router.use('/kit', kitRoutes);
router.use('/asignacion', asignacionRoutes);

router.use('/gastos', gastoRoutes);
router.get('/eventos/:id/rentabilidad', obtenerRentabilidad);

router.use('/eventos', eventoRoutes);

export default router;