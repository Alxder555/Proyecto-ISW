import { AppShell, Burger, Button, Group, NavLink, ScrollArea, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IconLogout } from '@tabler/icons-react';
import { useAuth } from '../services/AuthContext';
import { INICIO, seccionesVisibles } from '../config/menu';

function AppLayout() {
  const [abierto, { toggle, close }] = useDisclosure();
  const { usuario, logout } = useAuth();
  const { pathname } = useLocation();
  const secciones = seccionesVisibles(usuario);

  const activo = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !abierto } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={abierto} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={4}>Sistema de Inventario</Title>
          </Group>
          <Group gap="sm">
            <Text size="sm" visibleFrom="xs">
              {usuario.email}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconLogout size={16} />}
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <NavLink
            component={Link}
            to={INICIO.to}
            label={INICIO.label}
            leftSection={<INICIO.icon size={18} />}
            active={activo(INICIO.to)}
            onClick={close}
          />

          {secciones.map((seccion) => (
            <div key={seccion.titulo}>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mt="md" mb={4} px="sm">
                {seccion.titulo}
              </Text>
              {seccion.items.map((item) => (
                <NavLink
                  key={item.to}
                  component={Link}
                  to={item.to}
                  label={item.label}
                  leftSection={<item.icon size={18} />}
                  active={activo(item.to)}
                  onClick={close}
                />
              ))}
            </div>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;