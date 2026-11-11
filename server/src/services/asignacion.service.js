import prisma from "../config/prisma.js";

export const crearAsignacion = ({ eventoId, kitId, detalles }) => {
    return prisma.$transaction(async (tx) => {
        const evento = await tx.evento.findUnique({ where: { id: eventoId } });
        if (!evento) {
            const error = new Error('El evento especificado no existe');
            error.code = 'EVENTO_NOT_FOUND';
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
            const error = new Error('El kit ya se encuentra entregado en otro evento activo');
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
                eventoId, kitId, detalles: {
                    create: detalles.map((d) => ({
                        equipoId: d.equipoId,
                        estadoEntrega: d.estadoEntrega,
                        observaciones: d.observaciones,
                    })),
                },
            },
            include: {
                detalles: { include: { equipo: true } },
                evento: true,
                kit: true,
            },
        });
        return asignacion;
    })
}

export const registrarDevolucion = ({ asignacionId, detalles }) => {
    return prisma.$transaction(async (tx) => {
        const asignacion = await tx.asignacionKit.findUnique({
            where: { id: asignacionId },
            include: { detalles: true },
        });

        if (!asignacion) {
            const error = new Error('La asginacion especificada no existe');
            error.code = 'ASIGNACION_NOT_FOUND';
            throw error;
        }

        if (asignacion.fechaDevolucion) {
            const error = new Error('Esta asignacion ya fue devuelta anteriormente');
            error.code = 'ASIGNACION_YA_DEVUELTA'
            throw error;
        }

        const idsDetallesValidos = new Set(asignacion.detalles.map((d) => d.equipoId));
        const equipoInvalido = detalles.find((d) => !idsDetallesValidos.has(d.equipoId));

        if (equipoInvalido) {
            const error = new Error(`El equipo con id ${equipoInvalido.equipoId} no pertenece a esta asignacion`);
            error.code = 'EQUIPO_NO_PERTENECE_A_ASIGNACION'
            throw error;
        }

        if (detalles.length !== asignacion.detalles.length) {
            const error = new Error('Debes registrar la devolucion de todos los equipos de la asignacion');
            error.code = 'DEVOLUCION_INCOMPLETA'
            throw error;
        }

        for (const d of detalles) {
            const detalleExistente = asignacion.detalles.find((det) => det.equipoId === d.equipoId);
            await tx.detalleEquipoAsignacion.update({
                where: { id: detalleExistente.id },
                data: {
                    estadoDevolucion: d.estadoDevolucion,
                    observaciones: d.observaciones,
                },
            });
            await tx.equipo.update({
                where: { id: d.equipoId },
                data: { estado: d.estadoDevolucion },
            });
        }
        const asignacionActualizada = await tx.asignacionKit.update({
            where: { id: asignacionId },
            data: { fechaDevolucion: new Date() },
            include: {
                detalles: { include: { equipo: true } },
                evento: true,
                kit: true,
            },
        });
        return asignacionActualizada;
    });
}

export const listarAsignaciones = () => {
    return prisma.asignacionKit.findMany({
        orderBy: { fechaEntrega: 'desc' },
        include: {
            evento: { select: { id: true, nombre: true } },
            kit: { select: { id: true, nombre: true } },
            detalles: {
                include: { equipo: { select: { id: true, nombre: true, marca: true, modelo: true } } }
            },
        },
    });
}