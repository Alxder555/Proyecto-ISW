import prisma from "../config/prisma.js";

export const crearKit = (data) => {
    return prisma.kit.create({ data });
}

export const listarKits = () => {
    return prisma.kit.findMany({
        include: { equipos: true },
        orderBy: { createdAt: 'desc' },
    });
}

export const obtenerKitPorId = (id) => {
    return prisma.kit.findUnique({
        where: { id },
        include: { equipos: true },
    });
}

export const asignarEquipoAKit = (kitId, equipoId, motivo) => {
    return prisma.$transaction(async (tx) => {
        const kit = await tx.kit.findUnique({ where: { id: kitId } });
        if (!kit) {
            const error = new Error('El kit especificado no existe');
            error.code = 'KIT_NOT_FOUND';
            throw error;
        }

        const equipo = await tx.equipo.findUnique({ where: { id: equipoId } });
        if (!equipo) {
            const error = new Error('El equipo especificado no existe');
            error.code = 'EQUIPO_NOT_FOUND';
            throw error;
        }

        if (equipo.kitId && equipo.kitId !== kitId) {
            await tx.historialEquipoKit.updateMany({
                where: { equipoId, kitId: equipo.kitId, fechaSalida: null },
                data: { fechaSalida: new Date(), motivo: 'Reasginado a otros kit' },
            });
        }
        if (equipo.estado === 'DANADO' || equipo.estado === 'PERDIDO') {
            const error = new Error(`El equipo no puede ser asignado por que su estado acutal es ${equipo.estado}`);
            error.code = 'EQUIPO_NO_DISPONIBLE';
            throw error;
        }

        if (equipo.kitId && equipo.kitId !== kitId) {
            await tx.historialEquipoKit.updateMany({
                where: { equipoId, kitId: equipo.kitId, fechaSalida: null },
                data: { fechaSalida: new Date(), motivo: 'Reasignado a otro kit' },
            })
        }

        const equipoActualizado = await tx.equipo.update({
            where: { id: equipoId },
            data: { kitId },
        });

        await tx.historialEquipoKit.create({
            data: { equipoId, kitId, motivo: motivo ?? 'Ingreso al kit' }
        })
        return equipoActualizado;
    })
}