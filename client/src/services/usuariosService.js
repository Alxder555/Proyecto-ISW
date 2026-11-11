import { apiFetch } from './apiFetch';

export const crearUsuario = (data) =>
  apiFetch('/usuarios', { method: 'POST', body: data });

export const cambiarPassword = (id, password) =>
  apiFetch(`/usuarios/${id}/password`, { method: 'PATCH', body: { password } });