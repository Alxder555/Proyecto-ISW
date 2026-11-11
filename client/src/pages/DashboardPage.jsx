import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Card, Group, Loader, Alert } from '@mantine/core';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/dashboard/resumen`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No autorizado o no se pudieron cargar las métricas`);
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [API_URL]);

  return (
    <Container size="lg" py="xl">
      {/* Reemplazamos el Paper manual por el Navbar centralizado */}
      <Navbar />

      {/* Encabezado del Dashboard */}
      <Group justify="space-between" mb="lg" style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <div>
          <Title order={1}>Panel de Control — Resumen</Title>
          <Text color="dimmed" size="sm">Métricas rápidas del sistema</Text>
        </div>
      </Group>

      {loading && (
        <Group justify="center" my="xl">
          <Loader size="lg" />
          <Text>Cargando información...</Text>
        </Group>
      )}

      {error && (
        <Alert color="red" title="Aviso" mb="lg">
          {error}
        </Alert>
      )}

      {metrics && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Eventos Activos
            </Text>
            <Text fw={700} size="xl" c="blue" mt="sm">
              {metrics.eventosActivos}
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Equipos Ocupados
            </Text>
            <Text fw={700} size="xl" c="yellow" mt="sm">
              {metrics.equiposOcupados}
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Operadores Libres
            </Text>
            <Text fw={700} size="xl" c="green" mt="sm">
              {metrics.operadoresLibres}
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Pérdidas del Mes
            </Text>
            <Text fw={700} size="xl" c="red" mt="sm">
              ${Number(metrics.perdidasAcumuladasMes || 0).toLocaleString()}
            </Text>
          </Card>
        </SimpleGrid>
      )}
    </Container>
  );
}