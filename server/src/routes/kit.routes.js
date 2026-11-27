import { Router } from "express";
import { crearKit, listarKits, obtenerKit, asignarEquipo } from "../controllers/kit.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearKitSchema, asignarEquipoSchema, idParamSchema } from "../schemas/kit.schema.js";
import { requierePrivilegio } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requierePrivilegio('INVENTARIO', 'ADMINISTRADOR'))

router.post('/', validate(crearKitSchema), crearKit);
router.get('/', listarKits);
router.get('/:id', validate(idParamSchema, 'params'), obtenerKit);
router.post('/:id/equipos', validate(idParamSchema, 'params'), validate(asignarEquipoSchema), asignarEquipo);

export default router;