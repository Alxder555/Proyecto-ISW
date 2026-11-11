import { useEffect, useState, useCallback } from "react";
import { obtenerEquipos, crearEquipo } from "../services/equipoServices";
import { actualizarEquipo } from "../services/equipoServices";

export function useEquipos() {
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const cargarEquipos = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await obtenerEquipos();
            setEquipos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }, []);

    async function agregarEquipo(data) {
        const equipo = await crearEquipo(data);
        await cargarEquipos();
        return equipo;
    }

    async function editarEquipo(id, data) {
        const equipo = await actualizarEquipo(id, data);
        await cargarEquipos();
        return equipo;
    }

    useEffect(() => {
        cargarEquipos();
    }, [cargarEquipos]);

    return { equipos, cargando, error, agregarEquipo, editarEquipo, recargar: cargarEquipos };

}