import { Request, Response, NextFunction } from "express";
import jwt, { Jwt } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { models } from "../models";
import { ERROR_MESSAGES } from "../common/constants";
import { unprocessableEntityResponse } from "./response-handler.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return unprocessableEntityResponse(res, ERROR_MESSAGES.MISSING_TOKEN);

  try {
    const payload = jwt.verify(token, jwtConfig.accessSecret || '') as jwt.JwtPayload;
    const user = await models.User.findByPk(payload.sub);
    if (!user) return unprocessableEntityResponse(res, ERROR_MESSAGES.INVALID_TOKEN);
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return unprocessableEntityResponse(res, ERROR_MESSAGES.INVALID_TOKEN);
  }
};
