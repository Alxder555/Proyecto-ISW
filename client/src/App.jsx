import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./services/AuthContext";
import RutaProtegida from './components/RutaProtegida';
import RutaPrivilegiada from './components/RutaPrivilegiada';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import InicioPage from './pages/InicioPage';
import EquiposPage from './pages/EquiposPage';
import PaginaPendiente from './pages/PaginaPendiente';
import UsuariosPage from './pages/UsuariosPage';
import KitsPage from './pages/KitsPage';
import AsignacionesPage from './pages/AsignacionesPage';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RutaProtegida />}>
            <Route element={<AppLayout />}>
              <Route index element={<InicioPage />} />

              <Route element={<RutaPrivilegiada />}>
                <Route path="equipos" element={<EquiposPage />} />
                <Route path="kits" element={<KitsPage />} />
                <Route path="asignaciones" element={<AsignacionesPage />} />
                <Route path="eventos" element={<PaginaPendiente titulo="Eventos" />} />
                <Route path="gastos" element={<PaginaPendiente titulo="Gastos" />} />
                <Route path="perdidas" element={<PaginaPendiente titulo="Pérdidas" />} />
                <Route path="usuarios" element={<UsuariosPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App
