import { useMemo, useState } from 'react';
import { Alert, Button, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconRefresh, IconSearch } from '@tabler/icons-react';
import { useAuth } from '../services/AuthContext';
import { useEquipos } from '../hooks/useEquipos';
import { tienePrivilegio } from '../config/menu';
import { ESTADOS } from '../config/estados';
import EquipoTable from '../components/EquipoTable';
import EquipoFormModal from '../components/EquipoFormModal';

const OPCIONES_ESTADO = Object.entries(ESTADOS).map(([value, { label }]) => ({ value, label }));

function EquiposPage() {
  const { equipos, cargando, error, agregarEquipo, editarEquipo, recargar } = useEquipos();
  const { usuario } = useAuth();
  const puedeCrear = tienePrivilegio(usuario, ['rolInventario']);
  const puedeEditar = tienePrivilegio(usuario, ['rolInventario']);

  const [modalAbierto, { open, close }] = useDisclosure(false);
  const [equipoEditando, setEquipoEditando] = useState(null);

  const [exito, setExito] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState(null);

  function abrirNuevo() {
    setEquipoEditando(null);
    open();
  }

  function abrirEdicion(equipo) {
    setEquipoEditando(equipo);
    open();
  }

  async function guardar(datos) {
    if (equipoEditando) {
      const equipo = await editarEquipo(equipoEditando.id, datos);
      setExito(`Equipo "${equipo.nombre}" actualizado correctamente`);
    } else {
      const equipo = await agregarEquipo(datos);
      setExito(`Equipo "${equipo.nombre}" creado correctamente`);
    }
  }

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return equipos.filter((e) => {
      const coincideEstado = !estado || e.estado === estado;
      const coincideTexto =
        !texto ||
        [e.nombre, e.marca, e.modelo, e.kit?.nombre].some((v) => v?.toLowerCase().includes(texto));

      return coincideEstado && coincideTexto;
    });
  }, [equipos, busqueda, estado]);

  const hayFiltros = busqueda.trim() !== '' || estado !== null;

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Equipos</Title>
          {!cargando && !error && (
            <Text size="sm" c="dimmed">
              {filtrados.length} de {equipos.length} equipos
            </Text>
          )}
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconRefresh size={16} />}
            onClick={recargar}
            loading={cargando}
          >
            Actualizar
          </Button>
          {puedeCrear && (
            <Button leftSection={<IconPlus size={16} />} onClick={abrirNuevo}>
              Nuevo equipo
            </Button>

          )}
        </Group>
      </Group>

      {exito && (
        <Alert color="green" variant="light" withCloseButton onClose={() => setExito(null)}>
          {exito}
        </Alert>
      )}

      <Group>
        <TextInput
          placeholder="Buscar por nombre, marca, modelo o kit"
          leftSection={<IconSearch size={16} />}
          value={busqueda}
          onChange={(e) => setBusqueda(e.currentTarget.value)}
          w={{ base: '100%', sm: 360 }}
        />
        <Select
          placeholder="Todos los estados"
          data={OPCIONES_ESTADO}
          value={estado}
          onChange={setEstado}
          clearable
          w={{ base: '100%', sm: 200 }}
        />
      </Group>

      {error ? (
        <Alert color="red" title="No se pudo cargar el inventario">
          <Group justify="space-between">
            <Text size="sm">{error}</Text>
            <Button size="xs" variant="light" color="red" onClick={recargar}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      ) : (
        <EquipoTable
          equipos={filtrados}
          cargando={cargando}
          mensajeVacio={
            hayFiltros ? 'Ningún equipo coincide con la búsqueda' : 'Aún no hay equipos registrados'
          }
          onEditar={puedeEditar ? abrirEdicion : undefined}
        />
      )}
      <EquipoFormModal
        opened={modalAbierto}
        onClose={close}
        onSubmit={guardar}
        equipo={equipoEditando}
      />
    </Stack>
  );
}