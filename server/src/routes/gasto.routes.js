import { Router } from 'express';
import { crearGasto, obtenerGastos } from '../controllers/gasto.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { gastoSchema } from '../schemas/gasto.schema.js';
import { autenticar, requierePrivilegio } from '../middlewares/auth.middleware.js';

const router = Router();

// 1. Todas las rutas de este archivo exigen que el usuario haya iniciado sesión
router.use(autenticar);

// 2. Solo los usuarios con rol de CONTADOR (o SUPERVISOR) pueden registrar o ver gastos
router.post('/', requierePrivilegio('CONTADOR'), validate(gastoSchema), crearGasto);
router.get('/', requierePrivilegio('CONTADOR'), obtenerGastos);

export default router;