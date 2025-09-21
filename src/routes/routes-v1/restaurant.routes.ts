import { Router } from "express";
import { USER_ROLES } from "../../common/enums";
import restaurantController from "../../controllers/restaurant.controller";
import { authenticate, authorization } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  restaurantController.addNewRestaurant,
);
router.get("/", authenticate, restaurantController.getAll);
router.get("/:id", authenticate, restaurantController.getById);
router.put(
  "/:id",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  restaurantController.updateRestaurantDetails,
);
router.delete(
  "/:id",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  restaurantController.deleteRestaurantById,
);

export default router;
