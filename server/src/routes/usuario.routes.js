import { Router } from 'express';
import { crearUsuario, cambiarPassword } from '../controllers/usuario.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { requierePrivilegio } from '../middlewares/auth.middleware.js'
import { crearUsuarioSchema, cambiarPasswordSchema, idParamSchema } from '../schemas/usuario.schema.js'

const router = Router();

router.use(requierePrivilegio('ADMINISTRADOR'));

router.post('/', validate(crearUsuarioSchema), crearUsuario);
router.patch('/:id/password', validate(idParamSchema, 'params'), validate(cambiarPasswordSchema), cambiarPassword);

export default router;