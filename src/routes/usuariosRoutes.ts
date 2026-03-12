import { Router } from 'express';
// Asegúrate de importar también 'crearUsuario'
import { loginUsuario, modificarUsuario, crearUsuario, listarUsuarios } from '../controllers/usuariosController.js';

const router = Router();

// --- RUTAS DE USUARIO ---

// 1. Registro (Esta es la que te faltaba)
router.post('/crear', crearUsuario); 

// 2. Login
router.post('/login', loginUsuario);

// 3. Modificar Perfil
router.put('/modificar/:id', modificarUsuario);

router.get('/listar', validarToken, listarUsuarios);

export default router;