import { Router } from "express";
import equipoRoutes from './inventory.routes.js'

const router = Router();

router.use('/equipo',equipoRoutes);

export default router;