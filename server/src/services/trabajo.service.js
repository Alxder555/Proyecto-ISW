import prisma from '../config/prisma.js'

export const crearTrabajo = (data) => {
    return prisma.trabajo.create({ data });
}