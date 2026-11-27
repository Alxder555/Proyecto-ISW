const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/equipos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getEquipos = async () => {
  try {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    return [];
  }
};

export const createEquipo = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || error.error || 'Error al crear equipo');
  }
  return await res.json();
};

export const deleteEquipo = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar equipo');
  return await res.json();
};

// Alias de compatibilidad
export const obtenerEquipos = getEquipos;
export const crearEquipo = createEquipo;