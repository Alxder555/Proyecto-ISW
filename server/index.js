import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './src/routes/index.js';
import prisma from './src/config/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

async function bootstrap() {
    try {
        await prisma.$connect();

        console.log('=> Conexión a PostgreSQL establecida con éxito');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error(
            '=> Error al iniciar el servidor o conectar a PostgreSQL:',
            error
        );

        process.exit(1);
    }
}

bootstrap();