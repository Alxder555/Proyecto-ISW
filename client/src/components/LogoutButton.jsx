import { Button, Group, Text } from '@mantine/core';
import { useAuth } from '../services/AuthContext';

function LogoutButton() {
    const { usuario, logout } = useAuth();

    return (
        <Group justify="space-between">
            <Button variant="subtle" onClick={logout}>Cerrar sesión</Button>
        </Group>
    )
}

export default LogoutButton; 