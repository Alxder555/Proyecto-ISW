import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Modal,
  TextInput,
  MultiSelect,
  Paper,
  Stack,
  Table,
  Badge,
  Text,
  LoadingOverlay,
  ActionIcon
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Navbar } from '../components/Navbar';
import { getEventos, createEvento, deleteEvento } from '../services/eventosService';
import { getOperadores } from '../services/operadoresService';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [operadoresOptions, setOperadoresOptions] = useState([]);
  const [kitsOptions, setKitsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      cliente: '',
      fecha: '',
      hora: '',
      ubicacion: '',
      operadoresIds: [],
      kitsIds: []
    },
    validate: {
      cliente: (val) => (val ? null : 'El cliente es obligatorio'),
      fecha: (val) => (val ? null : 'La fecha es obligatoria'),
      ubicacion: (val) => (val ? null : 'La ubicación es obligatoria')
    }
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [dataEventos, dataOps] = await Promise.all([
        getEventos().catch(() => []),
        getOperadores().catch(() => [])
      ]);

      setEventos(dataEventos);

      // Mapear solo operadores disponibles
      setOperadoresOptions(
        dataOps
          .filter((op) => op.disponible)
          .map((op) => ({ value: String(op.id), label: `${op.nombre} (${op.funcion})` }))
      );

      // Kits de prueba (o conectables con tu servicio de kits)
      setKitsOptions([
        { value: '1', label: 'Kit Transmisión Pro 4K' },
        { value: '2', label: 'Kit Audio Inalámbrico' },
        { value: '3', label: 'Kit Iluminación LED Terreno' }
      ]);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const fechaHoraIso = new Date(`${values.fecha}T${values.hora || '00:00'}`).toISOString();

      await createEvento({
        cliente: values.cliente,
        fecha: fechaHoraIso,
        ubicacion: values.ubicacion,
        operadoresIds: values.operadoresIds.map(Number),
        kitsIds: values.kitsIds.map(Number)
      });

      setModalOpen(false);
      form.reset();
      cargarDatos();
    } catch (err) {
      console.error('Error al agendar evento:', err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este evento?')) {
      try {
        await deleteEvento(id);
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar evento:', err);
      }
    }
  };

  return (
    <Container size="lg" py="xl">
      <Navbar />

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Agendamiento de Eventos</Title>
          <Text color="dimmed" size="sm">
            Asignación de clientes, operadores y kits de trabajo
          </Text>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Agregar Evento</Button>
      </Group>

      <Paper shadow="xs" p="md" withBorder style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha y Hora</th>
              <th>Ubicación</th>
              <th>Operadores</th>
              <th>Kits</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'gray' }}>
                  No hay eventos agendados aún.
                </td>
              </tr>
            ) : (
              eventos.map((ev) => (
                <tr key={ev.id}>
                  <td>#{ev.id}</td>
                  <td><strong>{ev.cliente}</strong></td>
                  <td>{new Date(ev.fecha).toLocaleString()}</td>
                  <td>{ev.ubicacion}</td>
                  <td>
                    {ev.operadores?.map((op) => (
                      <Badge key={op.id} color="blue" size="sm" mr={4}>
                        {op.nombre}
                      </Badge>
                    ))}
                  </td>
                  <td>
                    {ev.kits?.map((k) => (
                      <Badge key={k.id} color="teal" size="sm" mr={4}>
                        {k.nombre}
                      </Badge>
                    ))}
                  </td>
                  <td>
                    <Badge color={ev.estado === 'ACTIVO' ? 'green' : 'gray'}>
                      {ev.estado}
                    </Badge>
                  </td>
                  <td>
                    <ActionIcon color="red" onClick={() => handleEliminar(ev.id)}>
                      🗑️
                    </ActionIcon>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agendar Nuevo Evento"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="sm">
            <TextInput
              label="Cliente"
              placeholder="Nombre del cliente o empresa"
              required
              {...form.getInputProps('cliente')}
            />
            <Group grow>
              <TextInput
                type="date"
                label="Fecha"
                required
                {...form.getInputProps('fecha')}
              />
              <TextInput
                type="time"
                label="Hora"
                {...form.getInputProps('hora')}
              />
            </Group>
            <TextInput
              label="Ubicación"
              placeholder="Dirección / Lugar del evento"
              required
              {...form.getInputProps('ubicacion')}
            />
            <MultiSelect
              label="Operadores Asignados"
              placeholder="Seleccionar personal disponible"
              data={operadoresOptions}
              {...form.getInputProps('operadoresIds')}
            />
            <MultiSelect
              label="Kits de Equipos"
              placeholder="Seleccionar kits"
              data={kitsOptions}
              {...form.getInputProps('kitsIds')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Evento</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}