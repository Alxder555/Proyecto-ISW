import { useMemo, useState } from 'react';
import {
  ActionIcon, Alert, Badge, Button, Group, Loader, Stack, Table, Text, Title, Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEye, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useAuth } from '../services/AuthContext';
import { useKits } from '../hooks/useKits';
import { useEquipos } from '../hooks/useEquipos';
import { tienePrivilegio } from '../config/menu';
import { estadoKit } from '../config/estadosKit';
import KitFormModal from '../components/KitFormModal';
import KitDrawer from '../components/KitDrawer';

function KitsPage() {
  const { usuario } = useAuth();
  const puedeEditar = tienePrivilegio(usuario, ['rolInventario']);

  const { kits, cargando, error, agregarKit, recargar } = useKits();
  const { equipos, recargar: recargarEquipos } = useEquipos();

  const [modalAbierto, modal] = useDisclosure(false);
  const [drawerAbierto, drawer] = useDisclosure(false);
  const [kitSeleccionado, setKitSeleccionado] = useState(null);
  const [exito, setExito] = useState(null);

  // Solo equipos en buen estado y sin kit pueden añadirse
  const equiposDisponibles = useMemo(
    () => equipos.filter((e) => e.estado === 'BUEN_ESTADO' && !e.kit),
    [equipos],
  );

  async function crear(datos) {
    const kit = await agregarKit(datos);
    setExito(`Kit "${kit.nombre}" creado correctamente`);
  }

  function abrirDetalle(kit) {
    setKitSeleccionado(kit.id);
    drawer.open();
  }

  function alCambiarKit() {
    recargar();
    recargarEquipos();
  }

  function contarEquipos(kit) {
    return kit.equipos?.length ?? kit._count?.equipos ?? 0;
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Kits</Title>
          {!cargando && !error && (
            <Text size="sm" c="dimmed">{kits.length} kits</Text>
          )}
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconRefresh size={16} />}
            onClick={alCambiarKit}
            loading={cargando}
          >
            Actualizar
          </Button>
          {puedeEditar && (
            <Button leftSection={<IconPlus size={16} />} onClick={modal.open}>
              Nuevo kit
            </Button>
          )}
        </Group>
      </Group>

      {exito && (
        <Alert color="green" variant="light" withCloseButton onClose={() => setExito(null)}>
          {exito}
        </Alert>
      )}

      {error ? (
        <Alert color="red" title="No se pudieron cargar los kits">
          <Group justify="space-between">
            <Text size="sm">{error}</Text>
            <Button size="xs" variant="light" color="red" onClick={recargar}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      ) : cargando && kits.length === 0 ? (
        <Loader />
      ) : kits.length === 0 ? (
        <Text c="dimmed">Aún no hay kits registrados</Text>
      ) : (
        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Equipos</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {kits.map((kit) => {
                const estado = estadoKit(kit.estado);
                return (
                  <Table.Tr key={kit.id}>
                    <Table.Td>{kit.nombre}</Table.Td>
                    <Table.Td>
                      <Badge color={estado.color} variant="light">{estado.label}</Badge>
                    </Table.Td>
                    <Table.Td>{contarEquipos(kit)}</Table.Td>
                    <Table.Td>
                      <Tooltip label="Ver y gestionar">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => abrirDetalle(kit)}
                          aria-label="Ver kit"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      <KitFormModal opened={modalAbierto} onClose={modal.close} onSubmit={crear} />

      <KitDrawer
        opened={drawerAbierto}
        onClose={drawer.close}
        kitId={kitSeleccionado}
        equiposDisponibles={equiposDisponibles}
        puedeEditar={puedeEditar}
        onCambio={alCambiarKit}
      />
    </Stack>
  );
}

export default KitsPage;