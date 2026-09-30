import { Router } from 'express';
import gastoRoutes from './gasto.routes.js';
import { obtenerRentabilidad } from '../controllers/evento.controller.js';

const router = Router();

router.use('/gastos', gastoRoutes);

router.get('/eventos/:id/rentabilidad', obtenerRentabilidad);

export default router;