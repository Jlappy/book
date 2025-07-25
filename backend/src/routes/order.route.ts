import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { onlyAdmin, onlyUser } from '../middlewares/auth-role.middleware';

const router = Router();
router.use(authMiddleware, onlyUser);

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.get('/:orderId', orderController.getOrderById);
router.get('/user/:userId', authMiddleware, onlyAdmin, orderController.getOrdersByUserId);

export default router;
