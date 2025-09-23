import { Router } from "express";
import reportController from "../../controllers/report.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/sales", authenticate, reportController.salesReport);

export default router;
