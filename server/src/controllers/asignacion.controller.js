import * as asignacionService from '../services/asignacion.service.js'

const codigosConflicto = new Set([
    'KIT_NO_DISPONIBLE',
    'EQUIPO_NO_PERTENCE_AL_KIT',
    'ASIGNACION_YA_DEVUELTA',
    'EQUIPO_NO_PERTENECE_A_ASIGNACION',
    'DEVOLUCION_INCOMPLETA'
]);

const codigosNoEncontrado = new Set([
    'TRABAJO_NOT_FOUND',
    'KIT_NOT_FOUND',
    'ASIGNACION_NOT_FOUND',
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
export const registrarDevolucion = async (req, res, next) => {
    try {
        const { detalles } = req.body;
        const asignacion = await asignacionService.registrarDevolucion(req.params.id, detalles);
        return res.status(200).json(asignacion);
    } catch (error) {
        if (codigosNoEncontrado.has(error.code)) {
            return res.status(404).json({ error: error.message });
        }
        if (codigosConflicto.has(error.code)) {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
}