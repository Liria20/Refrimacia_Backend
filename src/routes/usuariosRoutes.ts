import { Router } from 'express';
// Asegúrate de importar también 'crearUsuario'
import { loginUsuario, modificarUsuario, crearUsuario, listarUsuarios, solicitarCodigoRecuperacion, cambiarContrasena, obtenerPerfilPrivado } from '../controllers/usuariosController.js';
import { validarToken } from '../middlewares/auth.js';
import { validarRegistro } from '../middlewares/validaciones/usuario/validarRegistro.js';
import { validarLogin } from '../middlewares/validaciones/usuario/validarLogin.js';
import { validarUsuarioModificar } from '../middlewares/validaciones/usuario/validarUsuarioModificar.js';

const router = Router();

// --- RUTAS DE USUARIO ---
//! Es muy importante el orden de las funciones, ya que se ejecuta del primero al último
// 1. Registro (Esta es la que te faltaba)
router.post('/crear', validarRegistro, crearUsuario); 

// 2. Login
router.post('/login', validarLogin, loginUsuario);

// 3. Modificar Perfil
router.put('/modificar/:id', validarToken, validarUsuarioModificar, modificarUsuario);

router.get('/listar', validarToken, listarUsuarios);

router.get('/perfil', validarToken, obtenerPerfilPrivado);

// 4. Recuperación de contraseña
router.post('/solicitar-codigo', solicitarCodigoRecuperacion);

router.post('/cambiar-contrasena', cambiarContrasena);

export default router;