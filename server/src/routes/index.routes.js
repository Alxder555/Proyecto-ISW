import { Router } from "express";
import equipoRoutes from './equipo.routes.js'
import kitRoutes from './kit.routes.js'
import trabajoRoutes from './trabajo.routes.js'
import asignacionRoutes from './asignacion.routes.js'


const router = Router();

router.use('/equipo', equipoRoutes);
router.use('/kit', kitRoutes);
router.use('/trabajo',trabajoRoutes);
router.use('/asignacion',asignacionRoutes);

export default router;