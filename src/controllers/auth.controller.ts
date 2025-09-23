import { Request, Response } from 'express';
import { ERROR_MESSAGES } from '../common/constants';
import { IRefreshTokenResult } from '../common/interfaces/auth.interface';
import {
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import {
  createUser,
  findByUserId,
  findUserByEmail,
  getAllActiveMembers,
  updateUserDetails,
  userDeleted,
} from '../services/auth.service';
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
} from '../services/token.service';
import { loginSchema, signupSchema } from '../validations/auth.validation';
import { tokenSchema } from '../validations/token.validations';

export const userRegistration = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password, name, phoneNumber } = parsed.data;

  try {
    const existing = await findUserByEmail(email);
    if (existing) return conflictResponse(res, ERROR_MESSAGES.ALREADY_EXIST);

    const user = await createUser(email, password, name, phoneNumber);
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    successResponse(res, {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(res, 'An unknown error occurred during registration');
      return;
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, password } = parsed.data;
  try {
    const user = await findUserByEmail(email);
    if (!user)
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);

    if (user.status === 'INACTIVE')
      return unauthorizedResponse(res, 'You account is unavailable!');

    const ok = await user.comparePassword(password);
    if (!ok)
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    successResponse(res, { accessToken, refreshToken });
    return;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(res, 'An unknown error occurred during login.');
      return;
    }
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const [affectedRows] = await userDeleted(Number(req.params['id']));
    return affectedRows;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(res, 'An unknown error occurred during deleting.');
      return;
    }
  }
};

export const updateUserDetailsById = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) return badRequestResponse(res, parsed.error.toString());

  const { email, name, phoneNumber } = parsed.data;

  try {
    const id = req.params['id'];
    if (!id) return unprocessableEntityResponse(res);

    const isExist = await findByUserId(id);

    if (!isExist) {
      unprocessableEntityResponse(res);
      return;
    }

    const [affectedRows] = await updateUserDetails(
      id,
      email ?? isExist.email,
      name ?? isExist.name,
      phoneNumber || isExist?.phoneNumber
    );
    successResponse(res, affectedRows);
    return;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(res, 'An unknown error occurred during updating.');
      return;
    }
  }
};

export const getAllActiveUsers = async (req: Request, res: Response) => {
  try {
    const activeUsers = await getAllActiveMembers();
    return activeUsers;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(
        res,
        'An unknown error occurred during fetching active users.'
      );
      return;
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const parsed = tokenSchema.safeParse(req.body);

  if (!parsed.success)
    return badRequestResponse(res, ERROR_MESSAGES.INVALID_TOKEN);

  try {
    const { refreshToken } = parsed.data;

    const result = await rotateRefreshToken(refreshToken);

    if ((result as IRefreshTokenResult).error)
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_REFRESH_TOKEN);

    const { accessToken, refreshToken: newRefresh } =
      result as IRefreshTokenResult;

    successResponse(res, { accessToken, refreshToken: newRefresh });
    return;
  } catch (error) {
    if (error instanceof Error) {
      serverErrorResponse(res, error.message);
      return;
    } else {
      serverErrorResponse(
        res,
        'An unknown error occurred during token refresh.'
      );
      return;
    }
  }
};
