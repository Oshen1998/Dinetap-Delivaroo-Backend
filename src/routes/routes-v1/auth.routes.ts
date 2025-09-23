import { Router } from "express";
import { USER_ROLES } from "../../common/enums";
import {
  deleteUserById,
  getAllActiveUsers,
  login,
  refreshToken,
  updateUserDetailsById,
  userRegistration,
} from "../../controllers/auth.controller";
import { authenticate, authorization } from "../../middleware/auth.middleware";

const router = Router();

router.post("/signup", userRegistration);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get(
  "/all/users",
  authenticate,
  authorization([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
  getAllActiveUsers,
);
router.delete("/:id", authenticate, deleteUserById);
router.put("/:id", authenticate, updateUserDetailsById);

export default router;
