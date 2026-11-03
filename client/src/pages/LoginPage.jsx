import { useState } from "react";
import { Alert, Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from '@mantine/form'
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: {
            username: (v) => (v.trim().length > 0 ? null : 'El usuario es requerido'),
            password: (v) => (v.trim().length > 0 ? null : 'La contraseña es requerida')
        }
    });

    async function handleSubmit(values) {
        setError(null);
        setCargando(true);
        try {

            console.log('Login', values);
            navigate('/equipos', { replace: true });

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
                        <TextInput label="Nombre de usuario" autoComplete="username" required {...form.getInputProps('username')} />
                        <PasswordInput label="Contraseña" autoComplete="current-password" required {...form.getInputProps('password')} />
                        <Button type="submit" fullWidth loading={cargando}>Ingresar</Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    )

}
export default LoginPage;
