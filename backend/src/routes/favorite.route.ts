import { Router } from 'express';
import * as favoriteController from '../controllers/favorite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { onlyUser } from '../middlewares/auth-role.middleware';

const router = Router();
router.use(authMiddleware, onlyUser);

router.get('/', favoriteController.getFavorites);
router.get('/fav-books', favoriteController.getFavoriteBooks);
router.post('/', favoriteController.addFavorite);
router.delete('/:bookId', favoriteController.removeFavorite);

export default router;
