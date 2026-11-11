import { Alert } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import { ITEMS, tienePrivilegio } from '../config/menu.js';

function RutaPrivilegiada() {
  const { usuario } = useAuth();
  const { pathname } = useLocation();

  const item = ITEMS.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  if (item && !tienePrivilegio(usuario, item.privilegios)) {
    return (
      <Alert color="red" title="Acceso denegado">
        No tienes permisos para ver esta sección.
      </Alert>
    );
  }

  return <Outlet />;
}

export default RutaPrivilegiada;