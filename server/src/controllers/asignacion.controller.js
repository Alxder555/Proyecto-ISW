import * as asignacionService from '../services/asignacion.service.js'

const codigosConflicto = new Set([
    'KIT_NO_DISPONIBLE',
    'EQUIPO_NO_PERTENCE_AL_KIT',
]);

const codigosNoEncontrado = new Set([
    'TRABAJO_NOT_FOUND',
    'KIT_NOT_FOUND',
]);

export const crearAsignacion = async (req, res, next) => {
    try {
        const asignacion = await asignacionService.crearAsignacion(req.body);
        return res.status(201).json(asignacion);
    } catch (error) {
        if (codigosConflicto.has(error.code)) {
            return res.status(409).json({ error: error.message });
        }
        if (codigosNoEncontrado.has(error.code)) {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
}