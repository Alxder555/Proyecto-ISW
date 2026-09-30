import prisma from '../config/prisma.js';

export const obtenerRentabilidad = async (req, res, next) => {
    try {
        const eventoId = Number(req.params.id);

        const evento = await prisma.evento.findUnique({
            where: {
                id: eventoId,
            },
            include: {
                gastos: true,
                asignaciones: {
                    include: {
                        detalles: {
                            include: {
                                equipo: true,
                            },
                        },
                    },
                },
            },
        });

        if (!evento) {
            return res.status(404).json({
                error: 'Evento no encontrado',
            });
        }

        const ingresos =
            Number(evento.valorTransmision || 0) +
            Number(evento.aporteAuspiciador || 0);

        const gastos = evento.gastos.reduce(
            (total, gasto) => total + Number(gasto.monto),
            0
        );

        const perdidasEquipos = evento.asignaciones.reduce(
            (total, asignacion) => {
                return (
                    total +
                    asignacion.detalles.reduce((subtotal, detalle) => {
                        if (
                            detalle.estadoDevolucion === 'DANADO' ||
                            detalle.estadoDevolucion === 'PERDIDO'
                        ) {
                            return subtotal + Number(detalle.equipo.precio);
                        }

                        return subtotal;
                    }, 0)
                );
            },
            0
        );

        const resultado = ingresos - gastos - perdidasEquipos;

        res.status(200).json({
            eventoId: evento.id,
            evento: evento.nombre,
            ingresos,
            gastos,
            perdidasEquipos,
            resultado,
        });
    } catch (error) {
        next(error);
    }
};