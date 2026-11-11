import React, { useState } from 'react';
import { Tabs, Paper, Title, Text, Stack, Box } from '@mantine/core';
import GastosPage from './GastosPage';
import GananciasPage from './GananciasPage';

const ReportesPage = () => {
    const [tabActiva, setTabActiva] = useState('ganancias');

    return (
        <Box style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem 1.5rem' }}>
            <Stack spacing="xl" style={{ maxWidth: '1152px', margin: '0 auto' }}>
                
                {/* Encabezado */}
                <Box style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <Title order={1} style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.75rem' }}>
                        Panel Financiero
                    </Title>
                    <Text size="sm" c="dimmed" mt={4}>
                        Gestión y reportes de ganancias y gastos mensuales.
                    </Text>
                </Box>

                {/* Sistema de Pestañas con Mantine (Corregido a onChange) */}
                <Tabs value={tabActiva} onChange={setTabActiva} color="indigo">
                    <Tabs.List mb="md">
                        <Tabs.Tab value="ganancias">
                            📈 Ganancias Mensuales
                        </Tabs.Tab>
                        <Tabs.Tab value="gastos">
                            📉 Control de Gastos
                        </Tabs.Tab>
                    </Tabs.List>

                    {/* Tarjeta contenedora de la vista activa */}
                    <Paper shadow="xs" radius="md" p="xl" withBorder style={{ backgroundColor: '#ffffff' }}>
                        <Tabs.Panel value="ganancias">
                            <GananciasPage />
                        </Tabs.Panel>

                        <Tabs.Panel value="gastos">
                            <GastosPage />
                        </Tabs.Panel>
                    </Paper>
                </Tabs>

            </Stack>
        </Box>
    );
};

export default ReportesPage;