import { Request, Response } from "express";
import { signupSchema } from "../../validations/auth.validation";
import { models } from "../../models";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/auth.service";

export const userRegistration = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });

  const { email, password, name } = parsed.data;
  const existing = await models.User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: "EMAIL_EXISTS" });

  const user = await models.User.create({ email, password, name });
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  res
    .status(201)
    .json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
};
