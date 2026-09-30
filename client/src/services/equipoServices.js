const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerEquipos() {
    const res = await fetch(`${API_URL}/equipo`);
    if (!res.ok) throw new Error('Error al obtener equipos');
    return res.json();
}

export async function crearEquipo(data) {
    const res = await fetch(`${API_URL}/equipo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al crear equipo');
    }
    return res.json();
}