import { Badge } from '@mantine/core';
import { ESTADOS } from '../config/estados';

function EstadoBadge({ estado }) {
  const e = ESTADOS[estado] ?? { label: estado, color: 'gray' };
  return <Badge color={e.color} variant="light">{e.label}</Badge>;
}

export default EstadoBadge;