import { Stack, Text, Title } from '@mantine/core';

function PaginaPendiente({ titulo }) {
  return (
    <Stack>
      <Title order={2}>{titulo}</Title>
      <Text c="dimmed">Esta sección aún no está disponible.</Text>
    </Stack>
  );
}

export default PaginaPendiente;