import { Router } from 'express';
import { ejecutarSeed } from '../controllers/seedController.js';

const router = Router();

// La ruta raíz de este archivo responderá a las peticiones POST
router.post('/', ejecutarSeed);

export default router;