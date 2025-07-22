import { Router } from 'express';
import * as BookController from '../controllers/book.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/auth-role.middleware';

const router = Router();

router.get('/', BookController.getAllBooks);
router.get('/:bookId', BookController.getBookById);

// Admin only
router.post('/', authMiddleware, isAdmin, BookController.createBook);
router.put('/:bookId', authMiddleware, isAdmin, BookController.updateBook);
router.delete('/:bookId', authMiddleware, isAdmin, BookController.deleteBook);

export default router;
