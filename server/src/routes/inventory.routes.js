import { Router } from "express";
import { crearEquipo } from "../controllers/equipo.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearEquipoSchema } from "../schemas/equipo.schema.js";

const router = Router ();

router.post('/',validate(crearEquipoSchema),crearEquipo);

export default router;