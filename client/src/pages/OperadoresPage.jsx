import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Switch,
  Badge,
  Group,
  ActionIcon,
  Title,
  Paper,
  Stack,
  LoadingOverlay,
  Container,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Navbar from '../components/Navbar';
import { 
  getOperadores, 
  createOperador, 
  updateOperador, 
  toggleDisponibilidad 
} from '../services/operadoresService';

export function OperadoresPage() {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    initialValues: {
      nombre: '',
      contacto: '',
      funcion: '',
      disponible: true,
    },
    validate: {
      nombre: (value) => (value ? null : 'El nombre es obligatorio'),
      contacto: (value) => (value ? null : 'El contacto es obligatorio'),
      funcion: (value) => (value ? null : 'La función es obligatoria'),
    },
  });

  const cargarOperadores = async () => {
    setLoading(true);
    try {
      const data = await getOperadores();
      setOperadores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener operadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOperadores();
  }, []);

  const handleOpenModal = (operador = null) => {
    if (operador) {
      setEditingId(operador.id);
      form.setValues({
        nombre: operador.nombre,
        contacto: operador.contacto,
        funcion: operador.funcion,
        disponible: operador.disponible,
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await updateOperador(editingId, values);
      } else {
        await createOperador(values);
      }
      setModalOpen(false);
      cargarOperadores();
    } catch (error) {
      console.error('Error al guardar el operador:', error);
    }
  };

  const handleToggleState = async (id, estadoActual) => {
    try {
      await toggleDisponibilidad(id, !estadoActual);
      cargarOperadores();
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Navbar />

      <Stack spacing="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Control del Equipo Humano</Title>
            <Text color="dimmed" size="sm">
              Registro de operadores, contacto y estado de disponibilidad para terreno.
            </Text>
          </div>
          <Button onClick={() => handleOpenModal()}>
            + Nuevo Operador
          </Button>
        </Group>

        <Paper shadow="xs" p="md" withBorder style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Función</th>
                <th>Disponibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operadores.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'gray' }}>
                    No hay operadores registrados aún.
                  </td>
                </tr>
              ) : (
                operadores.map((op) => (
                  <tr key={op.id}>
                    <td>#{op.id}</td>
                    <td><strong>{op.nombre}</strong></td>
                    <td>{op.contacto}</td>
                    <td>{op.funcion}</td>
                    <td>
                      <Badge color={op.disponible ? 'green' : 'red'} variant="light">
                        {op.disponible ? 'Disponible' : 'En Terreno / No disponible'}
                      </Badge>
                    </td>
                    <td>
                      <Group gap="xs">
                        <Switch
                          checked={op.disponible}
                          onChange={() => handleToggleState(op.id, op.disponible)}
                          size="sm"
                          title="Cambiar estado rápido"
                        />
                        <ActionIcon color="blue" onClick={() => handleOpenModal(op)}>
                          ✏️
                        </ActionIcon>
                      </Group>
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
          title={editingId ? 'Editar Operador' : 'Registrar Nuevo Operador'}
          centered
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="sm">
              <TextInput
                label="Nombre Completo"
                placeholder="Ej. Andrés Silva"
                required
                {...form.getInputProps('nombre')}
              />
              <TextInput
                label="Contacto"
                placeholder="Ej. +56 9 8765 4321"
                required
                {...form.getInputProps('contacto')}
              />
              <TextInput
                label="Función / Cargo"
                placeholder="Ej. Operador de Video, Sonidista"
                required
                {...form.getInputProps('funcion')}
              />
              <Switch
                label="¿Disponible para salir a terreno?"
                {...form.getInputProps('disponible', { type: 'checkbox' })}
                mt="xs"
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
}

export default OperadoresPage;