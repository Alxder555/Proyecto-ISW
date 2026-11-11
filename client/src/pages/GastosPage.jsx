import React, { useState, useEffect } from 'react';
import { 
    TextInput, 
    Select, 
    NumberInput, 
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
import { obtenerGastos, crearGasto } from '../services/gastoService';

export default function GastosPage() {
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        eventoId: '',
        tipo: 'MOVILIZACION',
        monto: '',
        puntoSalida: '',
        puntoLlegada: '',
        comprobante: '',
        observacion: ''
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await obtenerGastos();
            setGastos(data);
        } catch (err) {
            setError('Error al cargar los gastos financieros');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                eventoId: Number(formData.eventoId),
                monto: parseFloat(formData.monto)
            };

            await crearGasto(payload);
            
            setFormData({
                eventoId: '',
                tipo: 'MOVILIZACION',
                monto: '',
                puntoSalida: '',
                puntoLlegada: '',
                comprobante: '',
                observacion: ''
            });
            cargarDatos();
        } catch (err) {
            alert('Error al registrar el gasto. Revisa los datos.');
            console.error(err);
        }
    };

    if (cargando) {
        return (
            <Box style={{ position: 'relative', minHeight: '200px' }}>
                <LoadingOverlay visible={true} loaderProps={{ color: 'indigo', type: 'bars' }} />
            </Box>
        );
    }

    return (
        <Stack spacing="xl">
            {/* Encabezado */}
            <Box style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <Title order={2} style={{ fontWeight: 700, color: '#1e293b' }}>Gestión Financiera y Reembolsos</Title>
                <Text size="sm" c="dimmed">Registra y administra los gastos operativos y viáticos del personal.</Text>
            </Box>

            {error && (
                <Alert color="red" variant="light" radius="md">
                    {error}
                </Alert>
            )}

            {/* Formulario de Registro Estilizado con Paper */}
            <Paper shadow="xs" radius="md" p="xl" withBorder style={{ backgroundColor: '#f8fafc' }}>
                <Title order={4} mb="lg" style={{ color: '#334155' }}>
                    Registrar Nuevo Gasto / Reembolso
                </Title>
                
                <form onSubmit={handleSubmit}>
                    <Stack spacing="md">
                        <Group grow preventGrowOverflow={false} breakpoints={{ maxWidth: 'sm', cols: 1 }}>
                            <TextInput 
                                label="ID de Evento" 
                                placeholder="Ej. 102"
                                type="number"
                                value={formData.eventoId} 
                                onChange={(e) => handleChange('eventoId', e.target.value)} 
                                required 
                            />
                            <Select
                                label="Tipo de Gasto"
                                value={formData.tipo}
                                onChange={(value) => handleChange('tipo', value)}
                                data={[
                                    { value: 'REMUNERACION', label: 'Remuneración Operador' },
                                    { value: 'MOVILIZACION', label: 'Movilización (Uber)' },
                                    { value: 'PEAJE', label: 'Peaje' },
                                    { value: 'OTRO', label: 'Otro' },
                                ]}
                            />
                        </Group>

                        <Group grow preventGrowOverflow={false} breakpoints={{ maxWidth: 'sm', cols: 1 }}>
                            <TextInput 
                                label="Monto ($)" 
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={formData.monto} 
                                onChange={(e) => handleChange('monto', e.target.value)} 
                                required 
                            />
                            <TextInput 
                                label="Comprobante (URL o Código)" 
                                placeholder="Ej. Enlace a boleta o voucher"
                                value={formData.comprobante} 
                                onChange={(e) => handleChange('comprobante', e.target.value)} 
                            />
                        </Group>
                        
                        {formData.tipo === 'MOVILIZACION' && (
                            <Group grow preventGrowOverflow={false} breakpoints={{ maxWidth: 'sm', cols: 1 }}>
                                <TextInput 
                                    label="Punto de Salida" 
                                    placeholder="Dirección de origen"
                                    value={formData.puntoSalida} 
                                    onChange={(e) => handleChange('puntoSalida', e.target.value)} 
                                />
                                <TextInput 
                                    label="Punto de Llegada" 
                                    placeholder="Dirección de destino"
                                    value={formData.puntoLlegada} 
                                    onChange={(e) => handleChange('puntoLlegada', e.target.value)} 
                                />
                            </Group>
                        )}
                        
                        <TextInput 
                            label="Observación" 
                            placeholder="Notas adicionales opcionales..."
                            value={formData.observacion} 
                            onChange={(e) => handleChange('observacion', e.target.value)} 
                        />
                        
                        <Box pt="sm">
                            <Button type="submit" color="indigo" radius="md">
                                Guardar Registro Financiero
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>

            {/* Listado de Gastos */}
            <Box>
                <Title order={4} mb="md" style={{ color: '#334155' }}>Historial de Gastos y Reembolsos</Title>
                
                {gastos.length === 0 ? (
                    <Paper p="xl" radius="md" withBorder style={{ textAlign: 'center', backgroundColor: '#f8fafc' }}>
                        <Text size="sm" c="dimmed">No hay registros financieros todavía.</Text>
                    </Paper>
                ) : (
                    <Paper shadow="xs" radius="md" withBorder style={{ overflow: 'hidden' }}>
                        <Table verticalSpacing="sm" horizontalSpacing="md">
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9' }}>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Monto</th>
                                    <th>Evento ID</th>
                                    <th>Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gastos.map((g) => (
                                    <tr key={g.id}>
                                        <td><Text size="sm" c="dimmed">{new Date(g.fecha).toLocaleDateString()}</Text></td>
                                        <td><Text size="sm" fw={600} c="indigo">{g.tipo}</Text></td>
                                        <td><Text size="sm" fw={500}>${g.monto}</Text></td>
                                        <td><Text size="sm" c="dimmed">#{g.eventoId}</Text></td>
                                        <td>
                                            <Text size="sm" c="dimmed">
                                                {g.puntoSalida ? `${g.puntoSalida} ➔ ${g.puntoLlegada}` : (g.observacion || 'Sin detalles')}
                                            </Text>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Paper>
                )}
            </Box>
        </Stack>
    );
}