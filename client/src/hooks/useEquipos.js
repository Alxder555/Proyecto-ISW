import { useEffect, useState, useCallback } from "react";
import { obtenerEquipos, crearEquipo } from "../services/equipoServices";

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
        await crearEquipo(data);
        await cargarEquipos();
    }
    useEffect(() => {
        cargarEquipos();
    }, [cargarEquipos]);

    return { equipos, cargando, error, agregarEquipo };

}