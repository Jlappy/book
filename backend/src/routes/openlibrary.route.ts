import { Router } from 'express';
import * as OpenLibraryController from '../controllers/openlibrary.controller';
const router = Router();

router.get('/search', OpenLibraryController.searchOpenLibraryBooks);

export default router;