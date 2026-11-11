import React, { useState } from 'react';
import { 
    TextInput, 
    Select, 
    Button, 
    Table, 
    Paper, 
    Title, 
    Text, 
    Group, 
    Stack, 
    Alert, 
    LoadingOverlay,
    Box
} from '@mantine/core';
import { obtenerGananciasMes } from '../services/gananciaService.js';

const GananciasMensuales = () => {
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(String(new Date().getMonth() + 1));
    const [dataGanancias, setDataGanancias] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConsultar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const resultado = await obtenerGananciasMes(Number(anio), Number(mes));
            setDataGanancias(resultado);
        } catch (err) {
            setError(err.error || 'No se pudo cargar el resumen');
        } finally {
            setLoading(false);
        }
    };

    const mesesOpciones = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: new Date(0, i).toLocaleString('es', { month: 'long' })
    }));

    return (
        <Stack spacing="xl">
            {/* Encabezado */}
            <Box style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <Title order={2} style={{ fontWeight: 700, color: '#1e293b' }}>Resumen de Ganancias Mensuales</Title>
                <Text size="sm" c="dimmed">Consulta las ganancias financieras y eventos registrados por periodo.</Text>
            </Box>

            {/* Formulario de selección con Paper */}
            <Paper shadow="xs" radius="md" p="xl" withBorder style={{ backgroundColor: '#f8fafc', position: 'relative' }}>
                <LoadingOverlay visible={loading} loaderProps={{ color: 'indigo', type: 'bars' }} />
                
                <form onSubmit={handleConsultar}>
                    <Group align="flex-end" grow>
                        <TextInput 
                            label="Año" 
                            type="number" 
                            value={anio} 
                            onChange={(e) => setAnio(e.target.value)} 
                            required 
                        />
                        <Select
                            label="Mes"
                            value={String(mes)}
                            onChange={(value) => setMes(value)}
                            data={mesesOpciones}
                        />
                        <Button type="submit" color="indigo" radius="md">
                            {loading ? 'Calculando...' : 'Consultar'}
                        </Button>
                    </Group>
                </form>
            </Paper>

            {error && (
                <Alert color="red" variant="light" radius="md">
                    {error}
                </Alert>
            )}

            {/* Resultados */}
            {dataGanancias && (
                <Stack spacing="lg">
                    {/* Tarjetas de Métricas */}
                    <Group grow>
                        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
                            <Text size="sm" c="dimmed" fw={500}>Total Ganancias del Mes</Text>
                            <Text size="xl" fw={700} c="blue" mt="xs">
                                ${dataGanancias.totalGananciasMes.toLocaleString()}
                            </Text>
                        </Paper>
                        
                        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
                            <Text size="sm" c="dimmed" fw={500}>Eventos Activos Registrados</Text>
                            <Text size="xl" fw={700} c="green" mt="xs">
                                {dataGanancias.cantidadEventos}
                            </Text>
                        </Paper>
                    </Group>

                    {/* Detalle de Eventos */}
                    <Box>
                        <Title order={4} mb="md" style={{ color: '#334155' }}>Detalle de Eventos</Title>
                        
                        {dataGanancias.eventos.length === 0 ? (
                            <Paper p="xl" radius="md" withBorder style={{ textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <Text size="sm" c="dimmed">No hay eventos en este periodo.</Text>
                            </Paper>
                        ) : (
                            <Paper shadow="xs" radius="md" withBorder style={{ overflow: 'hidden' }}>
                                <Table verticalSpacing="sm" horizontalSpacing="md">
                                    <thead>
                                        <tr style={{ backgroundColor: '#f1f5f9' }}>
                                            <th>Evento</th>
                                            <th>Cliente</th>
                                            <th>Fecha Fin</th>
                                            <th>Transmisión</th>
                                            <th>Auspiciador</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataGanancias.eventos.map(ev => (
                                            <tr key={ev.id}>
                                                <td><Text size="sm" fw={600}>{ev.nombre}</Text></td>
                                                <td><Text size="sm" c="dimmed">{ev.cliente || 'N/A'}</Text></td>
                                                <td><Text size="sm" c="dimmed">{new Date(ev.fechaFin).toLocaleDateString()}</Text></td>
                                                <td><Text size="sm">${ev.valorTransmision.toLocaleString()}</Text></td>
                                                <td><Text size="sm">${ev.aporteAuspiciador.toLocaleString()}</Text></td>
                                                <td><Text size="sm" fw={700} c="indigo">${ev.gananciaTotalEvento.toLocaleString()}</Text></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Paper>
                        )}
                    </Box>
                </Stack>
            )}
        </Stack>
    );
};

export default GananciasMensuales;