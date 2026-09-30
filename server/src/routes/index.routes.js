import { Router } from "express";
import equipoRoutes from './equipo.routes.js'
import kitRoutes from './kit.routes.js'

const router = Router();

router.use('/equipo', equipoRoutes);
router.use('/kit', kitRoutes);

export default router;