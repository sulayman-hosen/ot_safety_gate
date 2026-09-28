import { Router } from 'express';
import { openDemoSession, getSessionStatus, closeSession } from '../controllers/sessionController.js';
import { requireSameOrigin, requireJsonObject } from '../middleware/requestValidation.js';
import { requireSession, requireCsrfToken } from '../middleware/sessionAuthentication.js';

const router = Router();
router.get('/session', getSessionStatus);
router.post('/demo', requireSameOrigin, requireJsonObject, openDemoSession);
router.post('/logout', requireSession, requireSameOrigin, requireCsrfToken, closeSession);
export default router;
