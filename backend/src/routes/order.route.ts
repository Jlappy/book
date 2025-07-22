import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { onlyUser } from '../middlewares/auth-role.middleware';

const router = Router();
router.use(authMiddleware, onlyUser);

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.get('/:orderId', orderController.getOrderById);

export default router;
