import { Router } from 'express';
import { valorarReceta, obtenerMediaReceta } from '../controllers/valoracionesController.js';
import { validarToken } from '../middlewares/auth.js';


const router = Router();

// Ruta privada: Un usuario logueado vota una receta
router.post('/', validarToken, valorarReceta);

// Ruta pública: Cualquiera puede ver qué nota tiene una receta
router.get('/receta/:id_receta', obtenerMediaReceta);

export default router;