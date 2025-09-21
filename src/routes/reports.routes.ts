import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import reportController from "../controllers/report.controller";

const router = Router();

router.get("/sales", authenticate, reportController.salesReport);

export default router;
