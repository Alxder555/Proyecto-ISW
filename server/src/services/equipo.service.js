import prisma from '../config/prisma.js'

export const crearEquipo = (data) => {
  return prisma.equipo.create({ data });
}