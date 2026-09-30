import { Router } from "express";
import { crearEquipo, listarEquipos, obtenerEquipo, actualizarEquipo } from "../controllers/equipo.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearEquipoSchema,actualizarEquipoSchema,idParamSchema } from "../schemas/equipo.schema.js";

const router = Router ();

router.post('/',validate(crearEquipoSchema),crearEquipo);
router.get('/',listarEquipos);
router.get('/:id',validate(idParamSchema,'params'),obtenerEquipo);
router.patch('/:id',validate(idParamSchema,'params'),validate(actualizarEquipo),actualizarEquipo);


export default router;