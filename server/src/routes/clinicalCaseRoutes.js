import { Router } from 'express';
import { getClinicalCase } from '../controllers/clinicalCaseController.js';
import { requireSession } from '../middleware/sessionAuthentication.js';
const router = Router();
router.get('/case', requireSession, getClinicalCase);
export default router;
