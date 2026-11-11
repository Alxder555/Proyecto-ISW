import { Router } from "express";
import equipoRoutes from './equipo.routes.js'
import kitRoutes from './kit.routes.js'
import asignacionRoutes from './asignacion.routes.js'
import gastoRoutes from './gasto.routes.js';
import { obtenerRentabilidad } from '../controllers/evento.controller.js';
import eventoRoutes from './evento.routes.js';
import authRoutes from './auth.routes.js';
import { autenticar } from "../middlewares/auth.middleware.js";
import usuarioRoutes from './usuario.routes.js';
import gananciasRoutes from './ganancias.routes.js';


const router = Router();

router.use('/auth', authRoutes);

router.use(autenticar);

router.use('/usuarios',usuarioRoutes)
router.use('/equipos', equipoRoutes);
router.use('/kit', kitRoutes);
router.use('/asignacion', asignacionRoutes);

router.use('/gastos', gastoRoutes);
router.get('/eventos/:id/rentabilidad', obtenerRentabilidad);

router.use('/eventos', eventoRoutes);
router.use('/ganancias', gananciasRoutes);

export default router;