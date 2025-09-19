import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import restaurantController from "../controllers/restaurant/restaurant.controller";

const router = Router();

router.get("/", authenticate, restaurantController.getAll);

router.get("/:id", authenticate, restaurantController.getById);

export default router;
