import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/me', authMiddleware, UserController.getProfile);

export default router;
