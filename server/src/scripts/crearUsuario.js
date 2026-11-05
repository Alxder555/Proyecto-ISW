import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error('Uso: node scripts/crearUsuario.js correo@dominio.com contraseña');
  process.exit(1);
}

const usuario = await prisma.usuario.create({
  data: {
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    rolSupervisor: true,
  },
});

console.log('Usuario creado:', usuario.email);
await prisma.$disconnect();