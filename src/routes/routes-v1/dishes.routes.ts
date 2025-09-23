import { Router } from 'express';
import { USER_ROLES } from '../../common/enums';
import dishesController from '../../controllers/dishes.controller';
import { authenticate, authorization } from '../../middleware/auth.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  dishesController.createNewDish
);
router.get('/restaurant', authenticate, dishesController.RestaurantWiseDishes);
router.get('/', authenticate, dishesController.getAll);
router.get('/:id', authenticate, dishesController.getDishById);
router.put(
  '/:id',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  dishesController.updateDishDetails
);
router.delete(
  '/:id',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  dishesController.deleteDishById
);

export default router;
