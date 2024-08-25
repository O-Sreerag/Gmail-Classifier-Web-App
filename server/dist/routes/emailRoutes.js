// routes/emailRoutes.ts
import { Router } from 'express';
import { classifyEmailsController } from '../controllers/emailController';
const router = Router();
router.post('/classify', classifyEmailsController);
export default router;
