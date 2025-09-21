import { Router } from "express";
import dishesController from "../../controllers/dishes.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, dishesController.getAll);
router.get("/:id", dishesController.getById);

export default router;
