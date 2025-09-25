import { Request, Response } from 'express';
import { z } from 'zod';
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '../middleware/response-handler.middleware';
import {
  topSellingItems,
  totalSalesByPeriod,
} from '../services/reports.service';
import {
  salesQuerySchema,
  topItemsQuerySchema,
} from '../validations/report.validation';

export default {
  async getTotalSales(req: Request, res: Response) {
    console.log(req.query, 'getTotalSales');

    try {
      const parsed = salesQuerySchema.parse(req.query);
      const data = await totalSalesByPeriod(parsed.period, {
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.startDate ? { startDate: parsed.startDate } : {}),
        ...(parsed.endDate ? { endDate: parsed.endDate } : {}),
      });
      successResponse(res, data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        badRequestResponse(res, error.message);
      }
      serverErrorResponse(res);
    }
  },

  async getTopSellingItems(req: Request, res: Response) {
    try {
      const parsed = topItemsQuerySchema.parse(req.query);
      const data = await topSellingItems(parsed.metric, {
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.startDate ? { startDate: parsed.startDate } : {}),
        ...(parsed.endDate ? { endDate: parsed.endDate } : {}),
        ...(parsed.sortBy ? { sortBy: parsed.sortBy } : {}),
        ...(parsed.sortOrder ? { sortOrder: parsed.sortOrder } : {}),
        ...(parsed.page ? { page: parsed.page } : {}),
        ...(parsed.limit ? { limit: parsed.limit } : {}),
      });
      successResponse(res, data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        badRequestResponse(res, error.message);
      }
      serverErrorResponse(res);
    }
  },
};
