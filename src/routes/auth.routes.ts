import { Router } from "express";
import {
  login,
  refreshToken,
  userRegistration,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", userRegistration);
router.post("/login", login);
router.post("/refresh", refreshToken);

export default router;
