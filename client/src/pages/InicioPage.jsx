import {
  Alert, Badge, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title, UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { seccionesVisibles } from '../config/menu';

const ROLES = [
  ['rolAdministrador', 'Administrador'],
  ['rolSupervisor', 'Supervisor'],
  ['rolInventario', 'Inventario'],
  ['rolContador', 'Contador'],
];

function InicioPage() {
  const { usuario } = useAuth();
  const secciones = seccionesVisibles(usuario);
  const misRoles = ROLES.filter(([campo]) => usuario[campo]);

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Bienvenido</Title>
        <Text c="dimmed">{usuario.email}</Text>
        <Group gap="xs" mt="xs">
          {misRoles.length > 0 ? (
            misRoles.map(([campo, nombre]) => <Badge key={campo}>{nombre}</Badge>)
          ) : (
            <Badge color="gray" variant="light">Sin privilegios</Badge>
          )}
        </Group>
      </div>

      {secciones.length === 0 && (
        <Alert color="yellow" title="Sin opciones disponibles">
          Tu cuenta aún no tiene privilegios asignados. Pide a un administrador que te los asigne.
        </Alert>
      )}

      {secciones.map((seccion) => (
        <div key={seccion.titulo}>
          <Title order={4} mb="sm">{seccion.titulo}</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {seccion.items.map((item) => (
              <UnstyledButton key={item.to} component={Link} to={item.to}>
                <Card withBorder padding="lg" radius="md" h="100%">
                  <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon size="lg" variant="light">
                      <item.icon size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>{item.label}</Text>
                      <Text size="sm" c="dimmed">{item.descripcion}</Text>
                    </div>
                  </Group>
                </Card>
              </UnstyledButton>
            ))}
          </SimpleGrid>
        </div>
      ))}
    </Stack>
  );
}

export default InicioPage;