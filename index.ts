import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para obtener la ruta en ES Modules

// Importar las rutas
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import recetasRoutes from './src/routes/recetasRoutes.js';
import comentariosRoutes from './src/routes/comentariosRoutes.js';
import valoracionesRoutes from './src/routes/valoracionesRoutes.js';

dotenv.config();

// --- CONFIGURACIÓN DE RUTAS ABSOLUTAS ---
// Esto sustituye al __dirname tradicional que no existe en import/export
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Usamos path.join para que funcione igual en Windows (tu PC) y en Linux (Render)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// --- DEFINIR RUTAS ---
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor TS listo y escuchando en el puerto ${PORT}`);
});