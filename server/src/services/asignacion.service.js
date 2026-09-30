import prisma from "../config/prisma.js";

export const crearAsignacion = ({ trabajoId, kitId, detalles }) => {
    return prisma.$transaction(async (tx) => {
        const trabajo = await tx.trabajo.findUnique({ where: { id: trabajoId } });
        if (!trabajo) {
            const error = new Error('El trabajo especificado no existe');
            error.code = 'TRABAJO_NOT_FOUND';
            throw error;
        }
        const kit = await tx.kit.findUnique({
            where: { id: kitId },
            include: { equipos: true },
        });

        if (!kit) {
            const error = new Error('El kit especificado no existe');
            error.code = 'KIT_NOT_FOUND';
            throw error;
        }

        const asignacionActiva = await tx.asignacionKit.findFirst({
            where: { kitId, fechaDevolucion: null }
        });
        if (asignacionActiva) {
            const error = new Error('El kit ya se encuentra entregado en otro trabajo activo');
            error.code = 'KIT_NO_DISPONIBLE';
            throw error;
        }

        const idsEquiposDelKit = new Set(kit.equipos.map((e) => e.id));
        const equipoInvalido = detalles.find((d) => !idsEquiposDelKit.has(d.equipoId));
        if (equipoInvalido) {
            const error = new Error(`El equipo con id ${equipoInvalido.equipoId} no pertenece a este kit`);
            error.code = 'EQUIPO_NO_PERTENCE_AL_KIT';
            throw error;
        }
        const asignacion = await tx.asignacionKit.create({
            data: {
                trabajoId, kitId, detalles: {
                    create: detalles.map((d) => ({
                        equipoId: d.equipoId,
                        estadoEntrega: d.estadoEntrega,
                        observaciones: d.observaciones,
                    })),
                },
            },
            include: {
                detalles: { include: { equipo: true } },
                trabajo: true,
                kit: true,
            },
        });
        return asignacion;
    })
}