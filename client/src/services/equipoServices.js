import { apiFetch } from "./apiFetch";

export const obtenerEquipos = () => apiFetch('/equipos');
export const crearEquipo = (data) => apiFetch('/equipos', { method: 'POST', body: data });
export function actualizarEquipo(id, data) {
  return apiFetch(`/equipos/${id}`, { method: 'PATCH', body: data });
}