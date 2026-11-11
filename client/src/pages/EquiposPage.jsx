<<<<<<< Updated upstream
import { useEquipos } from '../hooks/useEquipos';
import EquipoForm from '../components/EquipoForm';
import EquipoList from '../components/EquipoList';
import LogoutButton from '../components/LogoutButton'
=======
import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Paper,
  Stack,
  Table,
  Badge,
  Text,
  LoadingOverlay,
  ActionIcon
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Navbar from '../components/Navbar';
import { getEquipos, createEquipo, deleteEquipo } from "../services/equiposServices";
>>>>>>> Stashed changes

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      nombre: '',
      marca: '',
      modelo: '',
      cantidad: 1,
      precio: 0,
      estado: 'BUEN_ESTADO'
    },
    validate: {
      nombre: (val) => (val ? null : 'El nombre es obligatorio'),
      marca: (val) => (val ? null : 'La marca es obligatoria'),
      modelo: (val) => (val ? null : 'El modelo es obligatorio'),
      precio: (val) => (val >= 0 ? null : 'El precio debe ser válido')
    }
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getEquipos();
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await createEquipo({
        ...values,
        cantidad: Number(values.cantidad),
        precio: Number(values.precio)
      });
      setModalOpen(false);
      form.reset();
      cargarDatos();
    } catch (err) {
      console.error('Error al crear equipo:', err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Deseas eliminar este equipo?')) {
      try {
        await deleteEquipo(id);
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar equipo:', err);
      }
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'BUEN_ESTADO': return 'green';
      case 'DANADO': return 'orange';
      case 'PERDIDO': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container size="lg" py="xl">
      <Navbar />

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Inventario de Equipos</Title>
          <Text color="dimmed" size="sm">
            Gestión física y de estado técnico de los equipos
          </Text>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Agregar Equipo</Button>
      </Group>

      <Paper shadow="xs" p="md" withBorder style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equipos.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'gray' }}>
                  No hay equipos registrados aún.
                </td>
              </tr>
            ) : (
              equipos.map((eq) => (
                <tr key={eq.id}>
                  <td>#{eq.id}</td>
                  <td><strong>{eq.nombre}</strong></td>
                  <td>{eq.marca}</td>
                  <td>{eq.modelo}</td>
                  <td>{eq.cantidad}</td>
                  <td>${Number(eq.precio).toLocaleString()}</td>
                  <td>
                    <Badge color={getBadgeColor(eq.estado)}>
                      {eq.estado}
                    </Badge>
                  </td>
                  <td>
                    <ActionIcon color="red" onClick={() => handleEliminar(eq.id)}>
                      🗑️
                    </ActionIcon>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Paper>

<<<<<<< Updated upstream
      <EquipoList equipos={equipos} cargando={cargando} />
      <LogoutButton></LogoutButton>
    </div>
=======
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Nuevo Equipo"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="sm">
            <TextInput
              label="Nombre del Equipo"
              placeholder="Ej. Cámara Sony FX3"
              required
              {...form.getInputProps('nombre')}
            />
            <Group grow>
              <TextInput
                label="Marca"
                placeholder="Ej. Sony"
                required
                {...form.getInputProps('marca')}
              />
              <TextInput
                label="Modelo"
                placeholder="Ej. FX3"
                required
                {...form.getInputProps('modelo')}
              />
            </Group>
            <Group grow>
              <NumberInput
                label="Cantidad"
                min={1}
                required
                {...form.getInputProps('cantidad')}
              />
              <NumberInput
                label="Precio ($)"
                min={0}
                required
                {...form.getInputProps('precio')}
              />
            </Group>
            <Select
              label="Estado Inicial"
              data={[
                { value: 'BUEN_ESTADO', label: 'Buen Estado' },
                { value: 'DANADO', label: 'Dañado' },
                { value: 'PERDIDO', label: 'Perdido' }
              ]}
              {...form.getInputProps('estado')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Equipo</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
>>>>>>> Stashed changes
  );
}