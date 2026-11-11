import { Button, MultiSelect, PasswordInput, Stack, TextInput, Title, Alert } from "@mantine/core";
import { useForm } from "@mantine/form"
import { useState } from "react";
import { crearUsuario } from "../services/usuariosService";


function UsuariosPage() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);


    const ROLES = [
        { value: "rolInventario", label: "Inventario" },
        { value: "rolContador", label: "Finanzas", },
        { value: "rolSupervisor", label: "Supervisor" },
        { value: "rolAdministrador", label: "Administrador" }
    ]

    const form = useForm({
        initialValues: { email: '', password: '', roles: [] },
        validate: {
            email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Correo electrónico inválido'),
            password: (v) => (v.length >= 8 ? null : 'La contraseña debe tener al menos 8 caracteres'),
        }
    });

    async function handleSubmit({ email, password, roles }) {
        setError(null);
        setExito(null)
        setCargando(true);
        try {
            const privilegios = Object.fromEntries(
                ROLES.map(({ value }) => [value, roles.includes(value)])
            );
            const usuario = await crearUsuario({ email, password, ...privilegios });
            setExito(`Usuario ${usuario.email} creado correctamente`);
            form.reset();
        } catch (err) {
            if (err.status === 409) {
                form.setFieldError('email', err.message);
            } else {
                setError(err.message);
            }
        } finally {
            setCargando(false);
        }

    }

    return (

        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack maw={480}>
                <Title order={2}>Crear nuevo usuario</Title>
                {error && <Alert color="red" variant="light">{error}</Alert>}
                {exito && <Alert color="green" variant="light">{exito}</Alert>}
                <TextInput
                    label="Correo electrónico"
                    placeholder="ejemplo@correo.com"
                    autoComplete="off"
                    required
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    label="Contraseña"
                    description="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    required
                    {...form.getInputProps('password')}
                />
                <MultiSelect
                    label="Privilegios"
                    placeholder="Selecciona uno o más"
                    data={ROLES}
                    clearable
                    {...form.getInputProps('roles')}
                />
                <Button type="submit" loading={cargando}> Crear usuario </Button>
            </Stack>
        </form>

    )
}

export default UsuariosPage;