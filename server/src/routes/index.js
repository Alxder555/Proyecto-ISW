import { Router } from 'express';
import gastoRoutes from './gasto.routes.js';

const router = Router();

router.use('/gastos', gastoRoutes);

export default router;