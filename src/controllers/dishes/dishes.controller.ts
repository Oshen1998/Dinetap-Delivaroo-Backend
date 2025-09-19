import { Request, Response } from "express";
import { Dish } from "../../models/dish";
import {
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../../middleware/response-handler.middleware";

export default {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.size as string) || 20;
      const offset = (page - 1) * limit;

      const dishes = await Dish.findAll({
        limit,
        offset,
      });

      successResponse(res, {
        dishes,
        page: page,
        count: dishes?.length || 0,
        size: limit,
      });
    } catch (err) {
      serverErrorResponse(res);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const dish = await Dish.findByPk(req.params.id);
      if (!dish) return notFoundErrorResponse(res);
      successResponse(res, dish);
    } catch (err) {
      serverErrorResponse(res);
    }
  },
};
