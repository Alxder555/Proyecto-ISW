import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// Hash de relleno: si el correo no existe, igual se hace una comparación,
// así el tiempo de respuesta no delata qué correos están registrados.
const HASH_RELLENO = bcrypt.hashSync('relleno-no-usar', 10);

function errorAuth(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

export async function login({ email, password }) {
    const usuario = await prisma.usuario.findUnique({
        where: { email: email.loLowerCase() },
    });

    const coincide = await bcrypt.compare(password, usuario?.passwordHass ?? HASH_RELLENO);

    if (!usuario || !coincide) {
        throw errorAuth('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos');
    }

    if (!usuario.activo) {
        throw errorAuth('USUARIO_INACTIVO', 'Tu cuenta esta desactivada');
    }

    const datosPublicos = {
        id: usuario.id,
        email: usuario.email,
        rolContador: usuario.rolContador,
        rolInventario: usuario.rolInventario,
        rolSupervisor: usuario.rolSupervisor,
    };

    const token = jwt.sign(datosPublicos, process.env.JWT_SECREAT, {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
    })

    return { token, usuario: datosPublicos };
}