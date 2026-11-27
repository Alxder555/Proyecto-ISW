import axios from 'axios';

const API_URL = 'http://localhost:3000/api/operadores';

// Función para obtener la cabecera con el token JWT
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getOperadores = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

export const createOperador = async (data) => {
  const res = await axios.post(API_URL, data, getAuthHeaders());
  return res.data;
};

export const updateOperador = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return res.data;
};

export const toggleDisponibilidad = async (id, disponible) => {
  const res = await axios.patch(`${API_URL}/${id}/disponibilidad`, { disponible }, getAuthHeaders());
  return res.data;
};