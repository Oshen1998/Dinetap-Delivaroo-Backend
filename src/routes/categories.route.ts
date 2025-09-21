import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import categoryController from '../controllers/category.controller';

const router = Router();

router.get('/', authenticate, categoryController.getAll);
router.get('/:id/dishes', authenticate, categoryController.getCategoryDishes);
router.get('/:id', authenticate, categoryController.getById);

export default router;
