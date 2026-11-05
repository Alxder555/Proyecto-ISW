import * as authService from '../services/auth.service.js';

const statusPorCodigo = {
    CREDENCIALES_INVALIDAS: 401,
    USUARIO_INACTIVO: 403,
};

export async function login(req, res, next) {
    try {
        const resultado = await authService.login(req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        const status = statusPorCodigo[error.code];
        if (status) {
            return res.status(status).json({ error: error.message })
        }
        next(error);
    }
}