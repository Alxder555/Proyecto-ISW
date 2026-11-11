import { Router } from "express";
import { crearAsignacion, registrarDevolucion, listarAsignaciones } from "../controllers/asignacion.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearAsignacionSchema, registrarDevolucionSchema, idParamSchema } from "../schemas/asignacion.schema.js"
import { requierePrivilegio } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/', validate(crearAsignacionSchema), crearAsignacion);
router.patch('/:id/devolucion', validate(idParamSchema, 'params'), validate(registrarDevolucionSchema), registrarDevolucion);
router.get('/', requierePrivilegio('INVENTARIO', 'SUPERVISOR'), listarAsignaciones);


export default router;