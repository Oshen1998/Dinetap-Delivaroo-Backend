import { Request, Response, NextFunction } from 'express';
import { serverErrorResponse } from './response-handler.middleware';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  serverErrorResponse(res);
}
