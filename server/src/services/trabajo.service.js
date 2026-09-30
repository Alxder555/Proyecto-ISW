import prisma from '../config/prisma.js'

export const crearTrabajo = (data) => {
    return prisma.kit.create({ data });
}