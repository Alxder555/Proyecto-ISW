import prisma from '../config/prisma.js'

export async function crearEvento({ operadoresIds, kitsIds, ...data }) {
  return prisma.evento.create({
    data: {
      ...data,
      operadores: operadoresIds
        ? { connect: operadoresIds.map((id) => ({ id })) }
        : undefined,
      kits: kitsIds
        ? { connect: kitsIds.map((id) => ({ id })) }
        : undefined,
    },
    include: {
      operadores: true,
      kits: true,
    },
  });
}