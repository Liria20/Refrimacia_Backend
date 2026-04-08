import { Router } from 'express';
import { 
    listarRecetas, 
    crearReceta, 
    modificarReceta, 
    eliminarReceta,
    obtenerRecetaPorId,
    buscarPorIngredientes,
    obtenerRecetaParaCompartir,
    obtenerMenuDelDia
} from '../controllers/recetasController.js';

import { validarToken } from '../middlewares/auth.js';
import { validarReceta } from '../middlewares/validaciones/recetas/validarReceta.js';
import { upload } from '../middlewares/upload.js'; // <--- 1. Importamos el middleware de subida

const router = Router();

// --- RUTAS DE CONSULTA (GET) ---

// Búsqueda por ingredientes
router.get('/buscar/ingredientes', validarToken, buscarPorIngredientes);

// Ruta para el "Oráculo" / Menú del día
router.get('/recomendacion/diaria', validarToken, obtenerMenuDelDia);

// Compartir receta (PÚBLICA)
router.get('/compartir/:id', obtenerRecetaParaCompartir);

// Listar todas las recetas
router.get('/listar', validarToken, listarRecetas);

// Obtener detalle por ID
router.get('/:id', validarToken, obtenerRecetaPorId);


// --- RUTAS DE ESCRITURA (POST, PUT, DELETE) ---

/**
 * 2. Añadimos upload.single('imagen_receta')
 * IMPORTANTE: Debe ir DESPUÉS del token pero ANTES de la validación de la receta.
 * El nombre 'imagen_receta' debe coincidir con el campo que envíes desde Postman/Android.
 */
router.post(
    '/crear', 
    validarToken, 
    upload.single('imagen_receta'), 
    validarReceta, 
    crearReceta
);

router.put(
    '/modificar/:id', 
    validarToken, 
    upload.single('imagen_receta'), 
    validarReceta, 
    modificarReceta
);

router.delete('/eliminar/:id', validarToken, eliminarReceta);

export default router;