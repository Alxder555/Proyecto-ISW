import { useCallback, useEffect, useState } from 'react';
import { listarKits, crearKit } from '../services/kitService';

export function useKits() {
  const [kits, setKits] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarKits = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setKits(await listarKits());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarKits();
  }, [cargarKits]);

  async function agregarKit(data) {
    const kit = await crearKit(data);
    await cargarKits();
    return kit;
  }

  return { kits, cargando, error, agregarKit, recargar: cargarKits };
}