import { Router } from 'express';
import { models } from '../models';
import { generateAccessToken, generateRefreshToken, rotateRefreshToken, revokeRefreshToken } from '../services/auth.service';
import { z } from 'zod';
import { loginSchema, signupSchema } from '../validations/auth.validation';
import { User } from '../models/user';
import { userRegistration } from '../controllers/auth/auth.controller';

const router = Router();

/**
 * POST /auth/signup
 */
router.post('/signup', userRegistration);

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { email, password } = parsed.data;
  const user = await models.User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

/**
 * POST /auth/refresh
 * Body: { refreshToken }
 */
export interface IResults{
    error: string;
    accessToken?: undefined;
    refreshToken?: undefined;
    user?: User;
} 
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'missing_refresh' });
  const result = await rotateRefreshToken(refreshToken);
  if ((result as IResults).error) return res.status(401).json({ error: 'invalid_refresh' });
  const { accessToken, refreshToken: newRefresh, user } = result as IResults;
  res.json({ accessToken, refreshToken: newRefresh, user: { id: user?.id, email: user?.email } });
});

/**
 * POST /auth/logout
 * Body: { refreshToken }
 */
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'missing_refresh' });
  await revokeRefreshToken(refreshToken);
  res.json({ ok: true });
});

export default router;
