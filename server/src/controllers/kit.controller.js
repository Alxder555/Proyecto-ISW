import * as kitService from '../services/kit.service.js';

export const crearKit = async (req, res, next) => {
    try {
        const kit = await kitService.crearKit(req.body);
        return res.status(200).json(kit);
    } catch (error) {
        next(error);
    }
}
export const listarKits = async (req, res, next) => {
    try {
        const kits = await kitService.listarKits();
        return res.status(200).json(kits);
    } catch (error) {
        next(error);
    }
}
export const obtenerKit = async (req, res, next) => {
    try {
        const kit = await kitService.obtenerKitPorId(req.params.id);
        if (!kit) {
            return res.status(404).json({ error: 'Kit no encontrado' });
        }
        return res.status(200).json(kit);
    } catch (error) {
        next(error);
    }
}

export const asignarEquipo = async (req, res, next) => {
    try {
        const { equipoId, motivo } = req.body;
        const equipo = await kitService.asignarEquipoAKit(req.params.id, equipoId, motivo);
        return res.status(200).json(equipo);
    } catch (error) {
        if (error.code === 'KIT_NOT_FOUND' || error.code === "EQUPO_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        }
        if (error.code === 'EQUIPO_NO_DISPONIBLE') {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
}