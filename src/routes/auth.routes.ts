import { Router } from "express";
import { rotateRefreshToken } from "../services/auth.service";
import { User } from "../models/user";
import { login, userRegistration } from "../controllers/auth/auth.controller";

const router = Router();

router.post("/signup", userRegistration);

router.post("/login", login);

/**
 * POST /auth/refresh
 * Body: { refreshToken }
 */
export interface IResults {
  error: string;
  accessToken?: undefined;
  refreshToken?: undefined;
  user?: User;
}

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: "missing_refresh" });
  const result = await rotateRefreshToken(refreshToken);
  if ((result as IResults).error)
    return res.status(401).json({ error: "invalid_refresh" });
  const { accessToken, refreshToken: newRefresh, user } = result as IResults;
  res.json({ accessToken, refreshToken: newRefresh });
});

export default router;
