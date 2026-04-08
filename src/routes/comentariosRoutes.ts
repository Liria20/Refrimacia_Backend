import { Router } from 'express';
import { crearComentario, eliminarComentario, listarComentariosPorReceta, modificarComentario } from '../controllers/comentarioController.js';
import { validarToken } from '../middlewares/auth.js';


const router = Router();

// GET /api/comentarios/receta/5 -> Lista todos los de la receta 5
router.get('/receta/:id_receta', listarComentariosPorReceta);

router.post('/crear', validarToken, crearComentario);

router.put('/modificar/:id', validarToken, modificarComentario);

router.delete('/eliminar/:id', validarToken, eliminarComentario);

export default router;