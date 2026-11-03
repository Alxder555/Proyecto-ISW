import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const CAMPO_POR_PRIVILEGIO = {
    CONTADOR: 'rolContador',
    INVENTARIO: 'rolInventario',
    SUPERVISOR: 'rolSupervisor',
}

export async function autenticar(req, res, next) {
    const [esquema, token] = (req.headers.authorization ?? '').split(' ');
    if (esquema !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Debes iniciar sesión' });
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
        return res.status(401).json({ error: 'Sesion inválida o expirada' });
    }

    const usuario = await prisma.usuario.findUnique({
        where: { id: payload.id },
        select: {
            id: true,
            email: true,
            activo: true,
            rolContador: true,
            rolInventario: true,
            rolSupervisor: true,
        },
    });

    if (!usuario || !usuario.activo) {
        return res.status(401).json({ error: 'Sesión inválida o expirada' });
    }

    req.usuario = usuario;
    next();

}


export function requierePrivilegio(...permitidos) {
    
    for (const p of permitidos) {
        if (!CAMPO_POR_PRIVILEGIO[p]) {
            throw new Error(`Privilegio desconocido: ${p}`);
        }
    }

    return (req, res, next) => {
        const usuario = req.usuario;

        if (!usuario) {
            return res.status(401).json({ error: 'Debes iniciar sesión' });
        }

        const autorizado = permitidos.some((p) => usuario[CAMPO_POR_PRIVILEGIO[p]]);

        if (!autorizado) {
            return res.status(403).json({ error: 'No tienes permisos para esta acción' });
        }

        next();
    };
}