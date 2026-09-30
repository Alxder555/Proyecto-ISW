import { Router } from "express";
import { crearAsignacion } from "../controllers/asignacion.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearAsignacionSchema } from "../schemas/asignacion.schema.js"

const router = Router();

router.post('/',validate(crearAsignacionSchema),crearAsignacion);

export default router;