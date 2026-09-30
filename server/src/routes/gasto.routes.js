import { Router } from 'express';
import { crearGasto, obtenerGastos } from '../controllers/gasto.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { gastoSchema } from '../schemas/gasto.schema.js';

const router = Router();

router.post('/', validate(gastoSchema), crearGasto);
router.get('/', obtenerGastos);

export default router;