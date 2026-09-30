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

export const registrarDevolucion = ({ asignacionId, detalles }) => {
    return prisma.$transaction(async (tx) => {
        const asignacion = await tx.asignacionKit.findUnique({
            where: { id: asignacionId },
            include: { detalles: true }
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
                trabajo: true,
                kit: true,
            },
        });
        return asignacionActualizada;
    });
}