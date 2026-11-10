import { useState } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from '@mantine/form'
import { useAuth } from '../services/AuthContext.jsx'

function LoginPage() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const destino = location.state?.from?.pathname ?? '/equipos';
    const { login, usuario, cargando: cargandoSesion } = useAuth();

    const form = useForm({
        initialValues: { email: '', password: '' },
        validate: {
            email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Correo electrónico inválido'),
            password: (v) => (v.trim().length > 0 ? null : 'La contraseña es requerida')
        }
    });

    if (cargandoSesion) return null;
    if (usuario) return <Navigate to={destino} replace />

    async function handleSubmit({ email, password }) {
        setError(null);
        setCargando(true);
        try {
            await login(email, password)

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <Center mih="100vh">
            <Paper w={420} maw="92vw" p="xl" radius="md" shadow="md" withBorder >
                <Stack>
                    <Title order={2} ta="center">
                        Iniciar Sesión
                    </Title>
                </Stack>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {error && (<Alert color="red" variant="light">{error}</Alert>)}
                        <TextInput label="Correo electrónico" autoComplete="email" required {...form.getInputProps('email')} />
                        <PasswordInput label="Contraseña" autoComplete="current-password" required {...form.getInputProps('password')} />
                        <Button type="submit" fullWidth loading={cargando}>Ingresar</Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    )

}
export default LoginPage;
