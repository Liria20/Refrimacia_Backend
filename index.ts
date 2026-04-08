import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Es buena práctica importar path para las rutas de archivos

// Importar las rutas
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import recetasRoutes from './src/routes/recetasRoutes.js';
import comentariosRoutes from './src/routes/comentariosRoutes.js';
import valoracionesRoutes from './src/routes/valoracionesRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- ESTO ES LO QUE TIENES QUE AÑADIR ---
// Hace que la carpeta 'uploads' sea accesible desde el navegador/móvil
app.use('/uploads', express.static('uploads')); 

// --- DEFINIR RUTAS ---
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor TS listo y escuchando en el puerto ${PORT}`);
});