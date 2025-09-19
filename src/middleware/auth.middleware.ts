import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { models } from "../models";

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "missing_token" });

  try {
    const payload = jwt.verify(token, jwtConfig.accessSecret) as any;
    const user = await models.User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ error: "invalid_token" });
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
};
