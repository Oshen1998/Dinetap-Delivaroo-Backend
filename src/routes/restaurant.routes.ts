import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import restaurantController from '../controllers/restaurant/restaurant.controller';

const router = Router();

/**
 * GET /restaurants
 * public list with pagination
 */
router.get('/', authenticate, restaurantController.getAll);

/**
 * GET /restaurants/:id
 */
router.get('/:id',authenticate, restaurantController.getById);


export default router;
