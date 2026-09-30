import * as trabajoService from '../services/trabajo.service.js'

export const crearTrabajo = async (req, res, next) => {
    try {
        const trabajo = await trabajoService.crearTrabajo(req.body);
        return res.status(201).json(trabajo);
    } catch (error) {
        next(error);
    }
}