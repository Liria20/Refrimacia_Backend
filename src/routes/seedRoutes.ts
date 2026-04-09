import { Router } from 'express';
import { ejecutarSeed, limpiarTablas } from '../controllers/seedController.js';

const router = Router();

router.post('/', ejecutarSeed);         // POST /api/seed
router.post('/limpiar', limpiarTablas); // POST /api/seed/limpiar

export default router;