import prisma from '../config/prisma.js'

export const crearEquipo = (data) => {
  return prisma.equipo.create({ data });
}

export const listarEquipos = () => {
  return prisma.equipo.findMany({
    include: { kit: true },
    orderBy: { createdAt: 'desc' },
  });
}

export const obtenerEquipoPorId = (id) => {
  return prisma.equipo.findUnique({
    where: { id },
    include: { kit: true },
  });
}

export const actualizarEquipo = (id, data) => {
  return prisma.equipo.update({
    where: { id },
    data,
  });
}