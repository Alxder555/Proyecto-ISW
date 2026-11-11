import { useEffect, useState } from 'react';
import {
  Alert, Button, Group, Modal, NumberInput, Select, Stack, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ESTADOS } from '../config/estados';

const OPCIONES_ESTADO = Object.entries(ESTADOS).map(([value, { label }]) => ({ value, label }));

const VALORES_NUEVO = {
  nombre: '',
  marca: '',
  modelo: '',
  cantidad: 1,
  precio: '',
  estado: 'BUEN_ESTADO',
};

function valoresDesde(equipo) {
  return {
    nombre: equipo.nombre,
    marca: equipo.marca,
    modelo: equipo.modelo,
    cantidad: equipo.cantidad,
    precio: Number(equipo.precio), // Decimal llega como string
    estado: equipo.estado,
  };
}

function EquipoFormModal({ opened, onClose, onSubmit, equipo = null }) {
  const editando = equipo !== null;
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: VALORES_NUEVO,
    validate: {
      nombre: (v) => (v.trim() ? null : 'El nombre es requerido'),
      marca: (v) => (v.trim() ? null : 'La marca es requerida'),
      modelo: (v) => (v.trim() ? null : 'El modelo es requerido'),
      cantidad: (v) =>
        Number.isInteger(Number(v)) && Number(v) > 0
          ? null
          : 'La cantidad debe ser un entero mayor a 0',
      precio: (v) => (Number(v) > 0 ? null : 'El precio debe ser mayor a 0'),
    },
  });

  // Cada vez que se abre, carga los datos del equipo (o limpia el formulario)
  useEffect(() => {
    if (!opened) return;
    const valores = equipo ? valoresDesde(equipo) : VALORES_NUEVO;
    form.setValues(valores);
    form.resetDirty(valores);
    form.clearErrors();
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, equipo]);

  function handleClose() {
    onClose();
  }

  async function handleSubmit(values) {
    const datos = {
      nombre: values.nombre.trim(),
      marca: values.marca.trim(),
      modelo: values.modelo.trim(),
      cantidad: Number(values.cantidad),
      precio: Number(values.precio),
      estado: values.estado,
    };

    // Al editar se envían solo los campos que cambiaron
    let payload = datos;
    if (editando) {
      const original = valoresDesde(equipo);
      payload = Object.fromEntries(
        Object.entries(datos).filter(([campo, valor]) => valor !== original[campo]),
      );
      if (Object.keys(payload).length === 0) {
        handleClose(); // nada que guardar
        return;
      }
    }

    setError(null);
    setCargando(true);

    try {
      await onSubmit(payload);
      handleClose();
    } catch (err) {
      if (err.status === 400 && Array.isArray(err.detalles)) {
        err.detalles.forEach(({ campo, mensaje }) => form.setFieldError(campo, mensaje));
        setError('Revisa los campos marcados');
      } else {
        setError(err.message);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={editando ? 'Editar equipo' : 'Nuevo equipo'}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {error && <Alert color="red" variant="light">{error}</Alert>}

          <TextInput label="Nombre" required data-autofocus {...form.getInputProps('nombre')} />

          <Group grow align="flex-start">
            <TextInput label="Marca" required {...form.getInputProps('marca')} />
            <TextInput label="Modelo" required {...form.getInputProps('modelo')} />
          </Group>

          <Group grow align="flex-start">
            <NumberInput
              label="Cantidad"
              required
              min={1}
              allowDecimal={false}
              {...form.getInputProps('cantidad')}
            />
            <NumberInput
              label="Precio"
              required
              min={0}
              decimalScale={2}
              allowNegative={false}
              {...form.getInputProps('precio')}
            />
          </Group>

          <Select
            label="Estado"
            data={OPCIONES_ESTADO}
            allowDeselect={false}
            {...form.getInputProps('estado')}
          />

          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={handleClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" loading={cargando}>
              {editando ? 'Guardar cambios' : 'Crear equipo'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default EquipoFormModal;