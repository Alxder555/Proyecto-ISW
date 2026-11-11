import prisma from '../config/prisma.js';

export const obtenerResumenGananciasMes = async (req, res) => {
    try {
        const { anio, mes } = req.query;

        if (!anio || !mes) {
            return res.status(400).json({ 
                error: 'Debes proporcionar el año y el mes (ej. ?anio=2026&mes=6)' 
            });
        }

        const fechaInicioMes = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
        const fechaFinMes = new Date(anio, mes, 0, 23, 59, 59, 999);

        const eventos = await prisma.evento.findMany({
            where: {
                fechaFin: {
                    gte: fechaInicioMes,
                    lte: fechaFinMes,
                },
                estado: "ACTIVO"
            },
            select: {
                id: true,
                nombre: true,
                cliente: true,
                fechaFin: true,
                valorTransmision: true,
                aporteAuspiciador: true,
            },
            orderBy: {
                fechaFin: 'asc'
            }
        });

        let totalGananciasMes = 0;

        const eventosConGanancias = eventos.map(evento => {
            const transmision = evento.valorTransmision ? Number(evento.valorTransmision) : 0;
            const auspiciador = evento.aporteAuspiciador ? Number(evento.aporteAuspiciador) : 0;
            
            const gananciaEvento = transmision + auspiciador;
            totalGananciasMes += gananciaEvento;

            return {
                id: evento.id,
                nombre: evento.nombre,
                cliente: evento.cliente,
                fechaFin: evento.fechaFin,
                valorTransmision: transmision,
                aporteAuspiciador: auspiciador,
                gananciaTotalEvento: gananciaEvento
            };
        });

        return res.status(200).json({
            success: true,
            mes: Number(mes),
            anio: Number(anio),
            totalGananciasMes,
            cantidadEventos: eventosConGanancias.length,
            eventos: eventosConGanancias
        });

    } catch (error) {
        console.error("Error al obtener el resumen de ganancias:", error);
        return res.status(500).json({ 
            success: false, 
            error: 'Error interno al calcular las ganancias del mes' 
        });
    }
};