import { Router } from 'express';
import { valorarReceta, obtenerMediaReceta, obtenerMiValoracion } from '../controllers/valoracionesController.js';
import { validarToken } from '../middlewares/auth.js';

const router = Router();

// Ruta privada: Un usuario logueado vota una receta
router.post('/', validarToken, valorarReceta);

// Ruta pública: Cualquiera puede ver qué nota tiene una receta
router.get('/receta/:id_receta', obtenerMediaReceta);

// Ruta privada: Saber si el usuario logueado ya ha votado esta receta (y qué nota le dio)
router.get('/mi-valoracion/:id_receta', validarToken, obtenerMiValoracion);

export default router;