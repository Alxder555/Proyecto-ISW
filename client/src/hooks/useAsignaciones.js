import { useCallback, useEffect, useState } from 'react';
import {
  listarAsignaciones,
  crearAsignacion,
  registrarDevolucion,
} from '../services/asignacionService';

export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setAsignaciones(await listarAsignaciones());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregarAsignacion(data) {
    const asignacion = await crearAsignacion(data);
    await cargar();
    return asignacion;
  }

  async function devolver(id, detalles) {
    await registrarDevolucion(id, detalles);
    await cargar();
  }

  return { asignaciones, cargando, error, agregarAsignacion, devolver, recargar: cargar };
}