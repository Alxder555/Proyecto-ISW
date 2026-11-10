import { Router } from "express";
import { crearAsignacion, registrarDevolucion } from "../controllers/asignacion.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearAsignacionSchema, registrarDevolucionSchema, idParamSchema } from "../schemas/asignacion.schema.js"

const router = Router();

router.post('/', validate(crearAsignacionSchema), crearAsignacion);
router.patch('/:id/devolucion', validate(idParamSchema, 'params'), validate(registrarDevolucionSchema), registrarDevolucion);

export default router;