// routes/emailRoutes.ts
import { Router } from 'express';
import { classifyEmailsController } from '../controllers/emailController.js';
const router = Router();
router.post('/classify', classifyEmailsController);
export default router;
