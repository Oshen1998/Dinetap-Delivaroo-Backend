import { Request, Response } from "express";
import { Category } from "../../models/category";
import {
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../../middleware/response-handler.middleware";
import { Dish } from "../../models/dish";
import { ERROR_MESSAGES } from "../../common/constants";

export default {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { rows: categories, count } = await Category.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      successResponse(res, {
        data: categories,
        pagination: {
          total: count,
          page,
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (err) {
      serverErrorResponse(res);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return notFoundErrorResponse(res);
      successResponse(res, category);
    } catch (err) {
      serverErrorResponse(res);
    }
  },

  async getCategoryDishes(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const category = await Category.findByPk(categoryId);
      if (!category) {
        return notFoundErrorResponse(res);
      }

      const { rows: dishes, count } = await Dish.findAndCountAll({
        where: { categoryId },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      successResponse(res, {
        category,
        dishes,
        pagination: {
          total: count,
          page,
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (err) {
      serverErrorResponse(res);
    }
  },
};
