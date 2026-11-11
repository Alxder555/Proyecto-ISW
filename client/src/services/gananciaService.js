import { apiFetch } from "./apiFetch";

export const obtenerGananciasMes = async (anio, mes) => {
    try {
        // Como apiFetch recibe la ruta y las opciones, enviamos los parámetros como query string
        const response = await apiFetch(`/ganancias/mes?anio=${anio}&mes=${mes}`);
        return response;
    } catch (error) {
        console.error('Error al obtener ganancias:', error);
        throw error;
    }
};