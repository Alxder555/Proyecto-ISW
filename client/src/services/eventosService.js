const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/eventos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// 1. EXPORT NOMBRADO getEventos
export const getEventos = async () => {
  try {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) {
      console.warn(`Error ${res.status} al obtener eventos`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error de red en getEventos:', error);
    return [];
  }
};

// 2. EXPORT NOMBRADO createEvento (Asegurar la palabra export)
export const createEvento = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.mensaje || 'Error al crear el evento');
  }
  return await res.json();
};

// 3. EXPORT NOMBRADO deleteEvento
export const deleteEvento = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar el evento');
  return await res.json();
};