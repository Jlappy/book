import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { onlyUser } from '../middlewares/auth-role.middleware';

const router = Router();
router.use(authMiddleware, onlyUser); // Áp dụng cho tất cả

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateQuantity);
router.delete('/:bookId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.get('/admin/:userId', authMiddleware, cartController.getCartByUserId);

export default router;
