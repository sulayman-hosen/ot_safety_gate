import { Router } from 'express';
import { createChecklistRecord, downloadChecklistRecord } from '../controllers/checklistRecordController.js';
import { requireSession, requireCsrfToken } from '../middleware/sessionAuthentication.js';
import { requireSameOrigin, requireJsonObject } from '../middleware/requestValidation.js';
const router = Router();
router.post('/records', requireSession, requireSameOrigin, requireCsrfToken, requireJsonObject, createChecklistRecord);
router.get('/records/:id', requireSession, downloadChecklistRecord);
export default router;
