import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./services/AuthContext";
import EquiposPage from "./pages/EquiposPage"
import GastosPage from "./pages/GastosPage";
import GananciasPage from "./pages/GananciasPage";
import ReportesPage from "./pages/ReportesPage";
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
            <Route path="/gastos" element={<GastosPage />} />
            <Route path="/ganancias" element={<GananciasPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/equipos" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App
