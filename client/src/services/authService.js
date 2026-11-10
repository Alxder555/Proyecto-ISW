import { apiFetch } from "./apiFetch";

export const login = (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false });

export const obtenerSesion = () => apiFetch('/auth/me');