import { apiFetch } from './apiFetch';

export function listarAsignaciones() {
  return apiFetch('/asignacion');
}

export function crearAsignacion(data) {
  return apiFetch('/asignacion', { method: 'POST', body: data });
}

export function registrarDevolucion(id, detalles) {
  return apiFetch(`/asignacion/${id}/devolucion`, { method: 'PATCH', body: { detalles } });
}