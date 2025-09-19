import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../../validations/auth.validation";
import { models } from "../../models";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/auth.service";
import {
  badRequestResponse,
  conflictResponse,
  successResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from "../../middleware/response-handler.middleware";

export const userRegistration = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password, name } = parsed.data;

  const existing = await models.User.findOne({ where: { email } });
  if (existing) return conflictResponse(res, "EMAIL_EXISTS");

  try {
    const user = await models.User.create({ email, password, name });
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    successResponse(res, {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      unprocessableEntityResponse(res, "SOMETHING_WENT_WRONG");
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password } = parsed.data;
  const user = await models.User.findOne({ where: { email } });
  if (!user) return unauthorizedResponse(res, "INVALID_CREDENTIALS");

  const ok = await user.comparePassword(password);
  if (!ok) return unauthorizedResponse(res);

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  successResponse(res, { accessToken, refreshToken });
};
