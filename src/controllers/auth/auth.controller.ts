import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../../validations/auth.validation";
import { models } from "../../models";
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
} from "../../services/auth.service";
import {
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../../middleware/response-handler.middleware";
import { ERROR_MESSAGES } from "../../common/constants";
import { IRefreshTokenResult } from "../../common/interfaces/auth.interface";
import { tokenSchema } from "../../validations/token.validations";

export const userRegistration = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password, name } = parsed.data;

  const existing = await models.User.findOne({ where: { email } });
  if (existing) return conflictResponse(res, ERROR_MESSAGES.ALREADY_EXIST);

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
    serverErrorResponse(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password } = parsed.data;
  const user = await models.User.findOne({ where: { email } });
  if (!user)
    return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);

  const ok = await user.comparePassword(password);
  if (!ok) return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  successResponse(res, { accessToken, refreshToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  const parsed = tokenSchema.safeParse(req.body);

  if (!parsed.success)
    return badRequestResponse(res, ERROR_MESSAGES.INVALID_TOKEN);

  const { refreshToken } = parsed.data;

  const result = await rotateRefreshToken(refreshToken);

  if ((result as IRefreshTokenResult).error)
    return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

  const { accessToken, refreshToken: newRefresh } =
    result as IRefreshTokenResult;
    
  successResponse(res, { accessToken, refreshToken: newRefresh });
};
