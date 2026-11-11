import { useEffect, useState } from 'react';
import {
  Alert, Badge, Button, Drawer, Group, Select, Stack, Table, Text, TextInput, Title,
} from '@mantine/core';
import { ESTADOS } from '../config/estados';
import EstadoBadge from './EstadoBadge';

const OPCIONES_ESTADO = Object.entries(ESTADOS).map(([value, { label }]) => ({ value, label }));

const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

function AsignacionDrawer({ opened, onClose, asignacion, puedeEditar, onDevolver }) {
  const [devoluciones, setDevoluciones] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const pendiente = asignacion && !asignacion.fechaDevolucion;
  const editable = pendiente && puedeEditar;

  // Al abrir, propone como estado de devolución el estado con que se entregó
  useEffect(() => {
    if (!opened || !asignacion) return;
    setError(null);
    setDevoluciones(
      Object.fromEntries(
        asignacion.detalles.map((d) => [
          d.equipoId,
          { estadoDevolucion: d.estadoEntrega, observaciones: '' },
        ]),
      ),
    );
  }, [opened, asignacion?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function actualizar(equipoId, campos) {
    setDevoluciones((prev) => ({ ...prev, [equipoId]: { ...prev[equipoId], ...campos } }));
  }

  async function handleDevolver() {
    setError(null);
    setGuardando(true);
    try {
      await onDevolver(
        asignacion.id,
        asignacion.detalles.map((d) => {
          const dev = devoluciones[d.equipoId];
          return {
            equipoId: d.equipoId,
            estadoDevolucion: dev.estadoDevolucion,
            ...(dev.observaciones.trim() && { observaciones: dev.observaciones.trim() }),
          };
        }),
      );
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      title={<Title order={4}>Asignación #{asignacion?.id}</Title>}
    >
      {asignacion && (
        <Stack>
          <Group gap="xl">
            <div>
              <Text size="xs" c="dimmed">Evento</Text>
              <Text>{asignacion.evento.nombre}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">Kit</Text>
              <Text>{asignacion.kit.nombre}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">Entregado</Text>
              <Text>{formatoFecha(asignacion.fechaEntrega)}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">Devuelto</Text>
              {pendiente ? (
                <Badge color="blue" variant="light">Pendiente</Badge>
              ) : (
                <Text>{formatoFecha(asignacion.fechaDevolucion)}</Text>
              )}
            </div>
          </Group>

          {error && <Alert color="red" variant="light">{error}</Alert>}
          {editable && (
            <Text size="sm" c="dimmed">
              Indica en qué estado volvió cada equipo. Se registra todo el kit de una vez.
            </Text>
          )}

          <Table.ScrollContainer minWidth={560}>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Equipo</Table.Th>
                  <Table.Th>Entrega</Table.Th>
                  <Table.Th>Devolución</Table.Th>
                  <Table.Th>Observaciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {asignacion.detalles.map((d) => (
                  <Table.Tr key={d.id}>
                    <Table.Td>
                      {d.equipo.nombre}
                      <Text size="xs" c="dimmed">{d.equipo.marca} {d.equipo.modelo}</Text>
                    </Table.Td>
                    <Table.Td><EstadoBadge estado={d.estadoEntrega} /></Table.Td>
                    <Table.Td>
                      {editable ? (
                        <Select
                          data={OPCIONES_ESTADO}
                          value={devoluciones[d.equipoId]?.estadoDevolucion ?? null}
                          onChange={(v) => actualizar(d.equipoId, { estadoDevolucion: v })}
                          allowDeselect={false}
                          w={150}
                        />
                      ) : d.estadoDevolucion ? (
                        <EstadoBadge estado={d.estadoDevolucion} />
                      ) : (
                        <Text c="dimmed">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {editable ? (
                        <TextInput
                          placeholder="Opcional"
                          value={devoluciones[d.equipoId]?.observaciones ?? ''}
                          onChange={(e) =>
                            actualizar(d.equipoId, { observaciones: e.currentTarget.value })
                          }
                        />
                      ) : (
                        <Text size="sm">{d.observaciones || '—'}</Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {editable && (
            <Group justify="flex-end">
              <Button variant="default" onClick={onClose} disabled={guardando}>
                Cancelar
              </Button>
              <Button onClick={handleDevolver} loading={guardando}>
                Registrar devolución
              </Button>
            </Group>
          )}
        </Stack>
      )}
    </Drawer>
  );
}

export default AsignacionDrawer;