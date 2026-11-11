import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js'

const COSTO_BCRYPT = 10;

const CAMPOS_PUBLICOS = {
    id: true,
    email: true,
    rolAdministrador: true,
    rolContador: true,
    rolInventario: true,
    rolSupervisor: true,
    activo: true,
    createdAt: true,
};

export async function crearUsuario({ password: passwordPlano, ...datos }) {
    const password = await bcrypt.hash(passwordPlano, COSTO_BCRYPT);

    try {
        return await prisma.usuario.create({
            data: { ...datos, password },
            select: CAMPOS_PUBLICOS,
        });
    } catch (error) {
        if (error.code === 'P2002') {
            const duplicado = new Error('Ya existe un usuario con ese correo');
            duplicado.code = 'EMAIL_DUPLICADO';
            throw duplicado;
        }
        throw error;
    }
}

export async function cambiarPassword({ id, password: passwordPlano }) {
    const hash = await bcrypt.hash(passwordPlano, COSTO_BCRYPT);

    try {
        await prisma.usuario.update({ where: { id }, data: { password: hash } });
    } catch (error) {
        if (error.code === 'P2025') {
            const noExiste = new Error('El usuario no existe');
            noExiste.code = 'USUARIO_NOT_FOUND';
            throw noExiste;
        }
        throw error;
    }
}