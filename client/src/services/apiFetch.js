const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'token';

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
    constructor(message, status, detalles) {
        super(message);
        this.status = status;
        this.detalles = detalles;
    }
}

let onUnauthorized = () => { };

export function setOnUnauthorized(fn) {
    onUnauthorized = fn;
}

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const token = tokenStorage.get();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError('No se pudo conectar con el servidor', 0);
    }

    if(res.status === 204) return null;
    
    const data = await res.json().catch(()=> null);

    if(!res.ok){
        if(res.status === 401 && auth) onUnauthorized();
        throw new ApiError(data?.error ?? 'Error del servidor', res.status, data?.detalles);
    }

    return data;
}