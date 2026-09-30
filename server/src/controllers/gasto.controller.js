import prisma from '../config/prisma.js';

export const crearGasto = async (req, res, next) => {
    try {
        const gasto = await prisma.gasto.create({
            data: req.body,
        });

        res.status(201).json(gasto);
    } catch (error) {
        next(error);
    }
};

export const obtenerGastos = async (req, res, next) => {
    try {
        const gastos = await prisma.gasto.findMany({
            include: {
                evento: true,
            },
            orderBy: {
                fecha: 'desc',
            },
        });

        res.status(200).json(gastos);
    } catch (error) {
        next(error);
    }
};