import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Badge, Button, Drawer, Group, Loader, Select, Stack, Table, Text, TextInput, Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ESTADOS } from '../config/estados';
import { estadoKit } from '../config/estadosKit';
import { agregarEquipoAKit, obtenerKit } from '../services/kitService';

function KitDrawer({ opened, onClose, kitId, equiposDisponibles, puedeEditar, onCambio }) {
  const [kit, setKit] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [equipoId, setEquipoId] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [agregando, setAgregando] = useState(false);
  const [errorAgregar, setErrorAgregar] = useState(null);

  const cargar = useCallback(async () => {
    if (!kitId) return;
    setCargando(true);
    setError(null);
    try {
      setKit(await obtenerKit(kitId));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [kitId]);

  useEffect(() => {
    if (opened) {
      setKit(null);
      setEquipoId(null);
      setMotivo('');
      setErrorAgregar(null);
      cargar();
    }
  }, [opened, cargar]);

  async function handleAgregar() {
    if (!equipoId) return;
    setErrorAgregar(null);
    setAgregando(true);
    try {
      await agregarEquipoAKit(kitId, {
        equipoId: Number(equipoId),
        ...(motivo.trim() && { motivo: motivo.trim() }),
      });
      setEquipoId(null);
      setMotivo('');
      await cargar();
      onCambio();
    } catch (err) {
      setErrorAgregar(err.message);
    } finally {
      setAgregando(false);
    }
  }

  const opcionesEquipo = equiposDisponibles.map((e) => ({
    value: String(e.id),
    label: `${e.nombre} · ${e.marca} ${e.modelo}`,
  }));

  const equipos = kit?.equipos ?? [];
  const estado = kit ? estadoKit(kit.estado) : null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={<Title order={4}>{kit?.nombre ?? 'Kit'}</Title>}
    >
      {cargando && !kit && <Loader />}

      {error && (
        <Alert color="red" title="No se pudo cargar el kit">
          <Group justify="space-between">
            <Text size="sm">{error}</Text>
            <Button size="xs" variant="light" color="red" onClick={cargar}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      )}

      {kit && (
        <Stack>
          <Group>
            <Badge color={estado.color} variant="light">{estado.label}</Badge>
            <Text size="sm" c="dimmed">{equipos.length} equipos</Text>
          </Group>

          {puedeEditar && (
            <Stack gap="xs">
              <Text fw={500}>Añadir equipo</Text>
              {errorAgregar && <Alert color="red" variant="light">{errorAgregar}</Alert>}
              <Select
                placeholder={
                  opcionesEquipo.length
                    ? 'Selecciona un equipo'
                    : 'No hay equipos disponibles (buen estado y sin kit)'
                }
                data={opcionesEquipo}
                value={equipoId}
                onChange={setEquipoId}
                searchable
                disabled={opcionesEquipo.length === 0}
              />
              <TextInput
                placeholder="Motivo (opcional)"
                value={motivo}
                onChange={(e) => setMotivo(e.currentTarget.value)}
              />
              <Group justify="flex-end">
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={handleAgregar}
                  loading={agregando}
                  disabled={!equipoId}
                >
                  Añadir al kit
                </Button>
              </Group>
            </Stack>
          )}

          <Text fw={500}>Equipos del kit</Text>
          {equipos.length === 0 ? (
            <Text size="sm" c="dimmed">Este kit aún no tiene equipos.</Text>
          ) : (
            <Table.ScrollContainer minWidth={400}>
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Marca</Table.Th>
                    <Table.Th>Modelo</Table.Th>
                    <Table.Th>Estado</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {equipos.map((e) => {
                    const est = ESTADOS[e.estado] ?? { label: e.estado, color: 'gray' };
                    return (
                      <Table.Tr key={e.id}>
                        <Table.Td>{e.nombre}</Table.Td>
                        <Table.Td>{e.marca}</Table.Td>
                        <Table.Td>{e.modelo}</Table.Td>
                        <Table.Td>
                          <Badge color={est.color} variant="light">{est.label}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Stack>
      )}
    </Drawer>
  );
}

export default KitDrawer;