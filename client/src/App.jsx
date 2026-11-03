import LoginPage from "./pages/LoginPage";
import EquiposPage from "./pages/EquiposPage"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/equipos" element={<EquiposPage />} />

        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
