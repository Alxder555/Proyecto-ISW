import { Badge, Center, Loader, Table, Text } from '@mantine/core';
import { ESTADOS } from '../config/estados.js'
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';


const formatoPrecio = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function EquipoTable({ equipos, cargando, mensajeVacio, onEditar }) {
    if (cargando) {
        return (
            <Center py="xl">
                <Loader />
            </Center>
        )
    }

    if (equipos.length === 0) {
        return (
            <Text c="dimmed" ta="center" py="xl">{mensajeVacio}</Text>
        );
    }

    return (
        <Table.ScrollContainer minWidth={720}>
            <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Marca</Table.Th>
                        <Table.Th>Modelo</Table.Th>
                        <Table.Th ta="right">Cantidad</Table.Th>
                        <Table.Th ta="right">Precio</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Kit</Table.Th>
                        {onEditar && <Table.Th />}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {equipos.map((equipo) => {
                        const estado = ESTADOS[equipo.estado];

                        return (
                            <Table.Tr key={equipo.id}>
                                <Table.Td fw={500}>{equipo.nombre}</Table.Td>
                                <Table.Td>{equipo.marca}</Table.Td>
                                <Table.Td>{equipo.modelo}</Table.Td>
                                <Table.Td ta="right">{equipo.cantidad}</Table.Td>
                                <Table.Td ta="right">{formatoPrecio.format(Number(equipo.precio))}</Table.Td>
                                <Table.Td>
                                    <Badge color={estado?.color ?? 'gray'} variant="light">
                                        {estado?.label ?? equipo.estado}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    {equipo.kit?.nombre ?? (
                                        <Text span c="dimmed">
                                            Sin kit
                                        </Text>
                                    )}
                                </Table.Td>
                                {onEditar && (
                                    <Table.Td>
                                        <Tooltip label="Editar">
                                            <ActionIcon variant="subtle" onClick={() => onEditar(equipo)} aria-label="Editar equipo">
                                                <IconPencil size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}

export default EquipoTable;