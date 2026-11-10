import { Button, MultiSelect, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form"
import { useState } from "react";


function UsuariosPage() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const roles = [{ id: "rolInventario", value: "Inventario" },
    { id: "rolContador", value: "Finanzas" },
    { id: "rolSupervisor", value: "Supervisor" },
    { id: "rolAdministrador", value: "Administrador" }
    ]

    const form = useForm({
        initialValues: { email: '', password: '' ,roles: []},
        validate: {
            email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Correo electrónico inválido'),
            password: (v) => (v.trim().length > 0 ? null : 'La contraseña es requerida'),
            roles: () => {},
        }
    });

    async function handleSubmit({ email, password, roles }) {
        console.log(email, password, roles);
        setCargando(true);
    }

    return (
        <Stack>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title>Crear nuevo usuario</Title>
                {error && (<Alert color="red" variant="light">{error}</Alert>)}
                <TextInput
                    label="Correo electrónico"
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    required
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    label="Contraseña"
                    autoComplete="password"
                    required
                    {...form.getInputProps('password')}
                />
                <MultiSelect
                    label="Privilegios"
                    data={roles}
                    {...form.getInputProps('roles')}
                />
                <Button type="submit" loading={cargando}> Crear usuario </Button>
            </form>
        </Stack>
    )
}

export default UsuariosPage;