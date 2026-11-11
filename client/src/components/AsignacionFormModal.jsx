import { useEffect, useState } from 'react';
import {
  Alert, Button, Group, Loader, Modal, Select, Stack, Table, Text, TextInput,
} from '@mantine/core';
import { ESTADOS } from '../config/estados';
import { obtenerKit } from '../services/kitService';

const OPCIONES_ESTADO = Object.entries(ESTADOS).map(([value, { label }]) => ({ value, label }));

function AsignacionFormModal({ opened, onClose, onSubmit, eventos, kits }) {
  const [eventoId, setEventoId] = useState(null);
  const [kitId, setKitId] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cargandoKit, setCargandoKit] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (opened) {
      setEventoId(null);
      setKitId(null);
      setDetalles([]);
      setError(null);
    }
  }, [opened]);

  async function elegirKit(valor) {
    setKitId(valor);
    setDetalles([]);
    setError(null);
    if (!valor) return;

    setCargandoKit(true);
    try {
      const kit = await obtenerKit(valor);
      const equipos = kit.equipos ?? [];
      if (equipos.length === 0) setError('Este kit no tiene equipos asignados');
      setDetalles(
        equipos.map((e) => ({
          equipoId: e.id,
          nombre: `${e.nombre} · ${e.marca} ${e.modelo}`,
          estadoEntrega: e.estado,
          observaciones: '',
        })),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCargandoKit(false);
    }
  }

  function actualizar(indice, campos) {
    setDetalles((prev) => prev.map((d, i) => (i === indice ? { ...d, ...campos } : d)));
  }

  async function handleSubmit() {
    setError(null);
    setGuardando(true);
    try {
      await onSubmit({
        eventoId: Number(eventoId),
        kitId: Number(kitId),
        detalles: detalles.map((d) => ({
          equipoId: d.equipoId,
          estadoEntrega: d.estadoEntrega,
          ...(d.observaciones.trim() && { observaciones: d.observaciones.trim() }),
        })),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  const opcionesEvento = eventos.map((e) => ({ value: String(e.id), label: e.nombre }));
  const opcionesKit = kits.map((k) => ({ value: String(k.id), label: k.nombre }));
  const puedeGuardar = eventoId && kitId && detalles.length > 0;

  return (
    <Modal opened={opened} onClose={onClose} title="Nueva asignación" size="xl" centered>
      <Stack>
        {error && <Alert color="red" variant="light">{error}</Alert>}

        <Group grow align="flex-start">
          <Select
            label="Evento"
            placeholder="Selecciona un evento"
            data={opcionesEvento}
            value={eventoId}
            onChange={setEventoId}
            searchable
            required
          />
          <Select
            label="Kit"
            placeholder={opcionesKit.length ? 'Selecciona un kit libre' : 'No hay kits libres'}
            data={opcionesKit}
            value={kitId}
            onChange={elegirKit}
            disabled={opcionesKit.length === 0}
            searchable
            required
          />
        </Group>

        {cargandoKit && <Loader size="sm" />}

        {detalles.length > 0 && (
          <>
            <Text fw={500}>Estado de cada equipo al entregarlo</Text>
            <Table.ScrollContainer minWidth={560}>
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Equipo</Table.Th>
                    <Table.Th w={170}>Estado</Table.Th>
                    <Table.Th>Observaciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {detalles.map((d, i) => (
                    <Table.Tr key={d.equipoId}>
                      <Table.Td>{d.nombre}</Table.Td>
                      <Table.Td>
                        <Select
                          data={OPCIONES_ESTADO}
                          value={d.estadoEntrega}
                          onChange={(v) => actualizar(i, { estadoEntrega: v })}
                          allowDeselect={false}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          placeholder="Opcional"
                          value={d.observaciones}
                          onChange={(e) => actualizar(i, { observaciones: e.currentTarget.value })}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={guardando} disabled={!puedeGuardar}>
            Entregar kit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default AsignacionFormModal;