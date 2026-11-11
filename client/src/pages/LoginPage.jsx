import { useState } from "react";
<<<<<<< Updated upstream
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
=======
import { Alert, Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Correo electrónico inválido'),
      password: (v) => (v.trim().length > 0 ? null : 'La contraseña es requerida')
>>>>>>> Stashed changes
    }
  });

  async function handleSubmit(values) {
    setError(null);
    setCargando(true);

    try {
      // Petición real al backend
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.mensaje || 'Error al iniciar sesión');
      }

      // Guardar el token devuelto por el backend
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirigir al Dashboard o Equipos
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Center mih="100vh">
      <Paper w={420} maw="92vw" p="xl" radius="md" shadow="md" withBorder>
        <Stack mb="lg">
          <Title order={2} ta="center">
            Iniciar Sesión
          </Title>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && <Alert color="red" variant="light">{error}</Alert>}
            
            <TextInput 
              label="Correo electrónico" 
              placeholder="tu@email.com"
              autoComplete="email" 
              required 
              {...form.getInputProps('email')} 
            />
            
            <PasswordInput 
              label="Contraseña" 
              placeholder="Tu contraseña"
              autoComplete="current-password" 
              required 
              {...form.getInputProps('password')} 
            />

            <Button type="submit" fullWidth loading={cargando} mt="sm">
              Ingresar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}