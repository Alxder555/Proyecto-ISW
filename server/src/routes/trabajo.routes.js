import { Router } from 'express';
import { crearTrabajo } from '../controllers/trabajo.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { crearTrabajoSchema } from '../schemas/trabajo.schema.js';

const router = Router();

router.post('/', validate(crearTrabajoSchema), crearTrabajo);

export default router;