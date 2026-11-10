import { apiFetch } from "./apiFetch";

export const obtenerEquipos = () => apiFetch('/equipo');
export const crearEquipo = (data) => apiFetch('/equipo', { method: 'POST', body: data });