import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url';

// Importar las rutas
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import recetasRoutes from './src/routes/recetasRoutes.js';
import comentariosRoutes from './src/routes/comentariosRoutes.js';
import valoracionesRoutes from './src/routes/valoracionesRoutes.js';

dotenv.config();

// Configuración para ES Modules (necesaria para path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- LA SOLUCIÓN AL "CANNOT GET" ---
// Usamos process.cwd() para asegurar que apunte a la raíz de RefriMancia en Render
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Log para que veas en la consola de Render si la ruta es correcta
console.log("📂 Servidor buscando archivos en:", uploadsPath);

// --- DEFINIR RUTAS ---
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor TS listo en el puerto ${PORT}`);
});