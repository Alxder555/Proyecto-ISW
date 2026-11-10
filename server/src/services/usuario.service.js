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

export async function crearUsuario({ password, ...datos }) {
    const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);

    try {
        return await prisma.usuario.create({
            data: { ...datos, passwordHash },
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

export async function cambiarPassword({ id, password }) {
    const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);
    await prisma.usuario.update({ where: { id }, data: { passwordHash } });
}