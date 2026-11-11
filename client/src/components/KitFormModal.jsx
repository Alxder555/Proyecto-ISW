import { useEffect, useState } from 'react';
import { Alert, Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function KitFormModal({ opened, onClose, onSubmit }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: { nombre: '' },
    validate: { nombre: (v) => (v.trim() ? null : 'El nombre es requerido') },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
      setError(null);
    }
  }, [opened]);

  async function handleSubmit(values) {
    setError(null);
    setCargando(true);
    try {
      await onSubmit({ nombre: values.nombre.trim() });
      onClose();
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
    <Modal opened={opened} onClose={onClose} title="Nuevo kit" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {error && <Alert color="red" variant="light">{error}</Alert>}
          <TextInput label="Nombre" required data-autofocus {...form.getInputProps('nombre')} />
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" loading={cargando}>
              Crear kit
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default KitFormModal;