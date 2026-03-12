import { Router } from 'express';
import { crearReceta, listarRecetas } from '../controllers/recetasController.js';

const router = Router();

// Esta ruta responderá a GET /api/recetas/listar
router.get('/listar', listarRecetas);
router.post('/nueva', crearReceta);

export default router;