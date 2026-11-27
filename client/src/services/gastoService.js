import { apiFetch } from './apiFetch';

// Obtener todos los gastos y reembolsos
export async function obtenerGastos() {
    return await apiFetch('/gastos', {
        method: 'GET',
    });
}

// Registrar un nuevo gasto o reembolso (Uber, remuneración, peaje, etc.)
export async function crearGasto(datosGasto) {
    return await apiFetch('/gastos', {
        method: 'POST',
        body: datosGasto, // Pasamos el objeto directamente; apiFetch se encarga de convertirlo a JSON
    });
}