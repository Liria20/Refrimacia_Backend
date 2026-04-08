import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar las rutas (Nota el .js final, es obligatorio en TS moderno)
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import recetasRoutes from './src/routes/recetasRoutes.js';
import comentariosRoutes from './src/routes/comentariosRoutes.js';
import valoracionesRoutes from './src/routes/valoracionesRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- DEFINIR RUTAS ---
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor TS listo y escuchando en el puerto ${PORT}`);
});