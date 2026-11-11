import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from './authService.js';
import { setOnUnauthorized, tokenStorage } from './apiFetch.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUsuario(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, usuario } = await authService.login(email, password);
    tokenStorage.set(token);
    setUsuario(usuario);
  }, []);

  useEffect(() => {
    // Cualquier 401 en una petición autenticada cierra la sesión
    setOnUnauthorized(logout);

    if (!tokenStorage.get()) {
      setCargando(false);
      return;
    }

    authService
      .obtenerSesion()
      .then(setUsuario)
      .catch(() => {}) // si fue 401, onUnauthorized ya limpió la sesión
      .finally(() => setCargando(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}