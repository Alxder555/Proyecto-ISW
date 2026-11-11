import { Router } from 'express';
import { obtenerResumenGananciasMes } from '../controllers/ganancias.controller.js';

const router = Router();

// Ruta: GET /api/ganancias/mes
router.get('/mes', obtenerResumenGananciasMes);

export default router;