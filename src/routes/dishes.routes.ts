import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import dishesController from "../controllers/dishes.controller";

const router = Router();

router.get("/", authenticate, dishesController.getAll);
router.get("/:id", dishesController.getById);

export default router;
