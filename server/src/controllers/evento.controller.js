import prisma from '../config/prisma.js';
import * as eventoService from '../services/evento.service.js';

export async function crearEvento(req, res, next) {
  try {
    const evento = await eventoService.crearEvento(req.body);
    return res.status(201).json(evento);
  } catch (error) {
    next(error);
  }
}

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

export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        operadores: true,
        kits: true,
      },
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los eventos', error: error.message });
  }
};

export const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await prisma.evento.findUnique({
      where: { id: Number(id) },
      include: {
        operadores: true,
        kits: true,
      },
    });

    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el evento', error: error.message });
  }
};

export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, fecha, ubicacion, estado } = req.body;

    const eventoActualizado = await prisma.evento.update({
      where: { id: Number(id) },
      data: {
        cliente,
        fecha: fecha ? new Date(fecha) : undefined,
        ubicacion,
        estado,
      },
      include: {
        operadores: true,
        kits: true,
      },
    });

    res.json(eventoActualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error al actualizar el evento', error: error.message });
  }
};

export const asignarOperadoresAEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { operadoresIds } = req.body;

    if (!Array.isArray(operadoresIds)) {
      return res.status(400).json({ mensaje: 'operadoresIds debe ser un arreglo de números' });
    }

    const eventoActualizado = await prisma.evento.update({
      where: { id: Number(id) },
      data: {
        operadores: {
          connect: operadoresIds.map((opId) => ({ id: Number(opId) })),
        },
      },
      include: { operadores: true },
    });

    res.json(eventoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al asignar operadores al evento', error: error.message });
  }
};

export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.evento.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error al eliminar el evento', error: error.message });
  }
};