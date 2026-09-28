import { Router } from 'express';
import { startSmartLaunch, completeSmartLaunch } from '../controllers/smartLaunchController.js';
const router = Router();
router.get('/launch', startSmartLaunch);
router.get('/api/smart/callback', completeSmartLaunch);
export default router;
