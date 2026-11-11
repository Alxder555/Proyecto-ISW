import { apiFetch } from './apiFetch';

export function listarKits() {
  return apiFetch('/kit');
}

export function obtenerKit(id) {
  return apiFetch(`/kit/${id}`);
}

export function crearKit(data) {
  return apiFetch('/kit', { method: 'POST', body: data });
}

export function agregarEquipoAKit(kitId, data) {
  return apiFetch(`/kit/${kitId}/equipos`, { method: 'POST', body: data });
}