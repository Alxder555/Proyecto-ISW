import { apiFetch } from './apiFetch';

export function obtenerEventos() {
  return apiFetch('/eventos');
}