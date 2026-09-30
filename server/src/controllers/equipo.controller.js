import * as equipoService from '../services/equipo.service.js'

export const crearEquipo = async (req, res, next) => {
    try {
        const equipo = await equipoService.crearEquipo(req.body);
        return res.status(201).json(equipo);
    } catch (error) {
        next(error);
    }
};

export const listarEquipos = async (req, res, next) => {
    try {
        const equipos = await equipoService.listarEquipos();
        return res.status(201).json(equipos);
    } catch (error) {
        next(error);
    }
}

export const obtenerEquipo = async (req, res, next) => {
    try {
        const equipo = await equipoService.obtenerEquipoPorId(req.params.id);
        if (!equipo) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }
        return res.status(200).json(equipo);
    } catch (error) {
        next(error);
    }
}

export const actualizarEquipo = async (req, res, next) => {
    try{
        const equipo = await equipoService.actualizarEquipo(req.params.id,req.body);
        return res.status(200).json(equipo);
    }catch(error){
        next(error);
    }
}