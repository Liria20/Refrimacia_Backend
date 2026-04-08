import { Router } from 'express';
import { 
    loginUsuario, 
    logoutUsuario, // <--- 1. Importamos la nueva función
    modificarUsuario, 
    crearUsuario, 
    listarUsuarios, 
    solicitarCodigoRecuperacion, 
    cambiarContrasena, 
    obtenerPerfilPrivado 
} from '../controllers/usuariosController.js';

import { validarToken } from '../middlewares/auth.js';
import { validarRegistro } from '../middlewares/validaciones/usuario/validarRegistro.js';
import { validarLogin } from '../middlewares/validaciones/usuario/validarLogin.js';
import { validarUsuarioModificar } from '../middlewares/validaciones/usuario/validarUsuarioModificar.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// --- RUTAS DE USUARIO ---

/**
 * 2. Registro con Foto de Perfil
 * El orden es: Primero procesamos la imagen, luego validamos los textos.
 */
router.post(
    '/crear', 
    upload.single('imagen_perfil'), 
    validarRegistro, 
    crearUsuario
); 

// Login (Sigue igual, no necesita archivos)
router.post('/login', validarLogin, loginUsuario);

// --- NUEVA RUTA DE LOGOUT ---
// Usamos POST y validarToken para saber de qué usuario borrar el token en MySQL
router.post('/logout', validarToken, logoutUsuario);

/**
 * 3. Modificar Perfil con Foto
 */
router.put(
    '/modificar/:id', 
    validarToken, 
    upload.single('imagen_perfil'), 
    validarUsuarioModificar, 
    modificarUsuario
);

router.get('/listar', validarToken, listarUsuarios);

router.get('/perfil', validarToken, obtenerPerfilPrivado);

// 4. Recuperación de contraseña
router.post('/solicitar-codigo', solicitarCodigoRecuperacion);

router.post('/cambiar-contrasena', cambiarContrasena);

export default router;