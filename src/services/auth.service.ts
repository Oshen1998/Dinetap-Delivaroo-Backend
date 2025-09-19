import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import crypto from 'crypto';
import { models } from '../models';
import { RefreshToken } from '../models/refreshToken';
import { User } from '../models/user';
import { msFromStr } from '../utils';
import { ERROR_MESSAGES } from '../common/constants';

const createRandomToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const generateAccessToken = async (user: User) => {
  const options: SignOptions = { expiresIn: Number(jwtConfig.accessExpiresIn) || '15m' };
  return jwt.sign({ sub: user.id, email: user.email }, jwtConfig.accessSecret || 'jwt_secrete', options);
};

export const generateRefreshToken = async (user: User) => {
  const token = createRandomToken();
  const hashed = RefreshToken.hashToken(token);
  const expiresAt = new Date(Date.now() + msFromStr(jwtConfig.refreshExpiresIn));
  await models.RefreshToken.create({
    hashedToken: hashed,
    userId: user.id,
    expiresAt,
  });
  return token;
};


export const rotateRefreshToken = async (token: string) => {
  const hashed = RefreshToken.hashToken(token);
  const existing = await models.RefreshToken.findOne({ where: { hashedToken: hashed } });

  if (!existing) {
    // token reuse detected: revoke all refresh tokens for user as precaution
    return { error: ERROR_MESSAGES.INVALID_INPUT };
  }

  if (existing.revokedAt || existing.isExpired) {
    // token is not usable
    return { error: ERROR_MESSAGES.TOKEN_EXPIRED };
  }

  // create new refresh token and mark old revoked
  const user = await models.User.findByPk(existing.userId);
  if (!user) return { error: ERROR_MESSAGES.OPERATION_FAILED};

  const newToken = createRandomToken();
  const hashedNew = RefreshToken.hashToken(newToken);
  const expiresAt = new Date(Date.now() + msFromStr(jwtConfig.refreshExpiresIn));

  await models.RefreshToken.create({
    hashedToken: hashedNew,
    userId: user.id,
    expiresAt,
  });

  existing.revokedAt = new Date();
  existing.replacedByToken = hashedNew;
  await existing.save();

  const accessToken = generateAccessToken(user);

  return { accessToken, refreshToken: newToken, user };
};



