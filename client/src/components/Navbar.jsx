import React from 'react';
import { Group, Button, Paper, Text } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <Paper p="sm" shadow="xs" radius="md" mb="xl" withBorder>
      <Group justify="space-between">
        <Text fw={700} size="lg">Sistema de Gestión</Text>
        <Group gap="xs">
          <Button 
            variant={location.pathname === '/dashboard' ? 'filled' : 'light'} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={location.pathname === '/eventos' ? 'filled' : 'light'} 
            onClick={() => navigate('/eventos')}
          >
            Eventos
          </Button>
          <Button 
            variant={location.pathname === '/equipos' ? 'filled' : 'light'} 
            onClick={() => navigate('/equipos')}
          >
            Equipos
          </Button>
          <Button 
            variant={location.pathname === '/operadores' ? 'filled' : 'light'} 
            onClick={() => navigate('/operadores')}
          >
            Equipo Humano
          </Button>
          <Button variant="outline" color="red" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

// AGREGAR ESTA LÍNEA AL FINAL DE NAVBAR.JSX:
export default Navbar;