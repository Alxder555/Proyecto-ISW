import * as equipoService from '../services/equipo.service.js'

export const crearEquipo = async (req, res, next) => {
    try {
        const equipo = await equipoService.crearEquipo(req.body);
        return res.status(201).json(equipo);
    } catch (error) {
        next(error);
    }
};