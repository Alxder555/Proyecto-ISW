import * as usuarioService from '../services/usuario.service.js'

export async function crearUsuario(req, res, next) {
    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        return res.status(201).json(usuario);
    } catch (error) {
        if (error.code === 'EMAIL_DUPLICADO') {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
}

export async function cambiarPassword(req, res, next) {
    try {
        await usuarioService.cambiarPassword({
            id: req.params.id,
            password: req.body.password,
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}