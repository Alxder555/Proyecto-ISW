import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon, Alert, Badge, Button, Group, Loader, SegmentedControl, Stack, Table, Text,
  Title, Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEye, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useAuth } from '../services/AuthContext';
import { useAsignaciones } from '../hooks/useAsignaciones';
import { useKits } from '../hooks/useKits';
import { obtenerEventos } from '../services/eventoService';
import { tienePrivilegio } from '../config/menu';
import AsignacionFormModal from '../components/AsignacionFormModal';
import AsignacionDrawer from '../components/AsignacionDrawer';

const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

function AsignacionesPage() {
  const { usuario } = useAuth();
  const puedeEditar = tienePrivilegio(usuario, ['rolInventario']);

  const { asignaciones, cargando, error, agregarAsignacion, devolver, recargar } =
    useAsignaciones();
  const { kits, recargar: recargarKits } = useKits();

  const [eventos, setEventos] = useState([]);
  const [errorEventos, setErrorEventos] = useState(null);

  const [modalAbierto, modal] = useDisclosure(false);
  const [drawerAbierto, drawer] = useDisclosure(false);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [exito, setExito] = useState(null);

  useEffect(() => {
    obtenerEventos().then(setEventos).catch((err) => setErrorEventos(err.message));
  }, []);

  const kitsLibres = useMemo(() => kits.filter((k) => k.estado === 'LIBRE'), [kits]);

  // El drawer siempre lee la versión más reciente de la lista
  const seleccionada = asignaciones.find((a) => a.id === seleccionadaId) ?? null;

  const filtradas = useMemo(
    () =>
      asignaciones.filter((a) => {
        if (filtro === 'pendientes') return !a.fechaDevolucion;
        if (filtro === 'devueltas') return !!a.fechaDevolucion;
        return true;
      }),
    [asignaciones, filtro],
  );

  async function crear(datos) {
    await agregarAsignacion(datos);
    recargarKits(); // el kit deja de estar libre
    setExito('Kit entregado correctamente');
  }

  async function registrarDevolucion(id, detalles) {
    await devolver(id, detalles);
    recargarKits(); // el kit vuelve a estar libre
    setExito('Devolución registrada correctamente');
  }

  function abrirDetalle(asignacion) {
    setSeleccionadaId(asignacion.id);
    drawer.open();
  }

  function actualizarTodo() {
    recargar();
    recargarKits();
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Asignaciones</Title>
          {!cargando && !error && (
            <Text size="sm" c="dimmed">
              {filtradas.length} de {asignaciones.length} asignaciones
            </Text>
          )}
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconRefresh size={16} />}
            onClick={actualizarTodo}
            loading={cargando}
          >
            Actualizar
          </Button>
          {puedeEditar && (
            <Button leftSection={<IconPlus size={16} />} onClick={modal.open}>
              Nueva asignación
            </Button>
          )}
        </Group>
      </Group>

      {exito && (
        <Alert color="green" variant="light" withCloseButton onClose={() => setExito(null)}>
          {exito}
        </Alert>
      )}
      {errorEventos && (
        <Alert color="orange" variant="light" title="No se pudieron cargar los eventos">
          {errorEventos}
        </Alert>
      )}

      <SegmentedControl
        value={filtro}
        onChange={setFiltro}
        data={[
          { value: 'todas', label: 'Todas' },
          { value: 'pendientes', label: 'Pendientes de devolución' },
          { value: 'devueltas', label: 'Devueltas' },
        ]}
        w={{ base: '100%', sm: 440 }}
      />

      {error ? (
        <Alert color="red" title="No se pudieron cargar las asignaciones">
          <Group justify="space-between">
            <Text size="sm">{error}</Text>
            <Button size="xs" variant="light" color="red" onClick={recargar}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      ) : cargando && asignaciones.length === 0 ? (
        <Loader />
      ) : filtradas.length === 0 ? (
        <Text c="dimmed">
          {asignaciones.length === 0
            ? 'Aún no hay asignaciones registradas'
            : 'Ninguna asignación coincide con el filtro'}
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={640}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Evento</Table.Th>
                <Table.Th>Kit</Table.Th>
                <Table.Th>Equipos</Table.Th>
                <Table.Th>Entrega</Table.Th>
                <Table.Th>Devolución</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtradas.map((a) => (
                <Table.Tr key={a.id}>
                  <Table.Td>{a.evento.nombre}</Table.Td>
                  <Table.Td>{a.kit.nombre}</Table.Td>
                  <Table.Td>{a.detalles.length}</Table.Td>
                  <Table.Td>{formatoFecha(a.fechaEntrega)}</Table.Td>
                  <Table.Td>
                    {a.fechaDevolucion ? (
                      formatoFecha(a.fechaDevolucion)
                    ) : (
                      <Badge color="blue" variant="light">Pendiente</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={a.fechaDevolucion || !puedeEditar ? 'Ver detalle' : 'Ver / devolver'}>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => abrirDetalle(a)}
                        aria-label="Ver asignación"
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      <AsignacionFormModal
        opened={modalAbierto}
        onClose={modal.close}
        onSubmit={crear}
        eventos={eventos}
        kits={kitsLibres}
      />

      <AsignacionDrawer
        opened={drawerAbierto}
        onClose={drawer.close}
        asignacion={seleccionada}
        puedeEditar={puedeEditar}
        onDevolver={registrarDevolucion}
      />
    </Stack>
  );
}

export default AsignacionesPage;