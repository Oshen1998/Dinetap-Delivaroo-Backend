import { Router } from 'express';
import { USER_ROLES } from '../../common/enums';
import orderController from '../../controllers/order.controller';
import { authenticate, authorization } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', orderController.createOrder);

router.get(
  '/',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  orderController.getAllOrders
);

router.get(
  '/:id',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  orderController.getAllRestaurantWiseOrders
);

router.get('/:id', authenticate, orderController.getOrderById);

router.delete(
  '/:id',
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  orderController.deleteOrder
);

export default router;
