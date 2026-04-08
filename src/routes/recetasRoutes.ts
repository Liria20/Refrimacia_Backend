import { Router } from 'express';
import { 
    listarRecetas, 
    crearReceta, 
    modificarReceta, 
    eliminarReceta,
    obtenerRecetaPorId,
    buscarPorIngredientes,
    obtenerRecetaParaCompartir,
    obtenerMenuDelDia // <--- 1. Importamos la nueva función
} from '../controllers/recetasController.js';
import { validarToken } from '../middlewares/auth.js';
import { validarReceta } from '../middlewares/validaciones/recetas/validarReceta.js';

const router = Router();

// --- RUTAS DE CONSULTA (GET) ---

// Búsqueda por ingredientes
router.get('/buscar/ingredientes', validarToken, buscarPorIngredientes);

// Ruta para el "Oráculo" / Menú del día
// La ponemos arriba para que no choque con :id
router.get('/recomendacion/diaria', validarToken, obtenerMenuDelDia);

// Compartir receta (PÚBLICA)
router.get('/compartir/:id', obtenerRecetaParaCompartir);

// Listar todas las recetas
router.get('/listar', validarToken, listarRecetas);

// Obtener detalle por ID (Siempre al final de los GET)
router.get('/:id', validarToken, obtenerRecetaPorId);


// --- RUTAS DE ESCRITURA (POST, PUT, DELETE) ---

router.post('/crear', validarToken, validarReceta, crearReceta);

router.put('/modificar/:id', validarToken, validarReceta, modificarReceta);

router.delete('/eliminar/:id', validarToken, eliminarReceta);

export default router;