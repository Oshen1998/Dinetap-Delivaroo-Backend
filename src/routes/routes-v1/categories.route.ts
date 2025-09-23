import { Router } from "express";
import { USER_ROLES } from "../../common/enums";
import categoryController from "../../controllers/category.controller";
import { authenticate, authorization } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  categoryController.createCategoryDetails,
);
router.get(
  "/",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  categoryController.getAll,
);
router.get("/:id/dishes", authenticate, categoryController.getCategoryDishes);
router.get("/:id", authenticate, categoryController.getCategoryDetails);
router.put(
  "/:id",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  categoryController.updateCategoryDetails,
);
router.delete(
  "/:id",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  categoryController.deleteCategoryDetails,
);

export default router;
