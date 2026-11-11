import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
<<<<<<< Updated upstream
import { AuthProvider } from "./services/AuthContext";
import EquiposPage from "./pages/EquiposPage"
import RutaProtegida from "./components/RutaProtegida"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RutaProtegida />}>
            <Route path="/equipos" element={<EquiposPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/equipos" replace />} />
        </Routes>
      </AuthProvider>
=======
import EquiposPage from "./pages/EquiposPage";
import DashboardPage from "./pages/DashboardPage";
import OperadoresPage  from "./pages/OperadoresPage"; 
import EventosPage from './pages/EventosPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/operadores" element={<OperadoresPage />} /> 
        <Route path="/eventos" element={<EventosPage />} />

        {/* Redirección por defecto a /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}

export default App;