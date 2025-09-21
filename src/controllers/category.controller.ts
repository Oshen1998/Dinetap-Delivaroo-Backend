import { Request, Response } from 'express';
import {
  badRequestResponse,
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import { Category } from '../models/category';
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  getCategoryDishesWithPagination,
  updateCategory,
} from '../services/categories.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation';

export default {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const offset = (page - 1) * limit;

      const { rows: categories, count } = await Category.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
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
      return;
    }
  },

  async getCategoryDishes(req: Request, res: Response) {
    try {
      const categoryId = req.params['id'];
      if (!categoryId) {
        return badRequestResponse(res, 'ID is required');
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const offset = (page - 1) * limit;

      const category = await findCategoryById(categoryId);
      if (!category) {
        notFoundErrorResponse(res);
        return;
      }

      const { rows: dishes, count } = await getCategoryDishesWithPagination(
        categoryId,
        limit,
        offset
      );

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

      return;
    } catch (err) {
      serverErrorResponse(res);
      return;
    }
  },

  async createCategoryDetails(req: Request, res: Response) {
    try {
      const parsed = createCategorySchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const category = await createCategory(parsed.data);
      successResponse(res, category, 'Successfully created!');
    } catch (err) {
      unprocessableEntityResponse(res);
    }
  },

  async getCategoryDetails(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id)
        return unprocessableEntityResponse(res, 'Category Id is Required!');

      const category = await findCategoryById(id);
      if (!category) return notFoundErrorResponse(res, 'Category not found');

      successResponse(res, category);
    } catch (err) {
      unprocessableEntityResponse(res);
    }
  },

  async updateCategoryDetails(req: Request, res: Response) {
    try {
      const parsed = updateCategorySchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const id = req.params['id'];
      if (!id)
        return unprocessableEntityResponse(res, 'Category Id is Required!');

      const category = await findCategoryById(id);
      if (!category) return notFoundErrorResponse(res, 'Category not found');

      const updated = await updateCategory(parsed.data, id);
      successResponse(res, updated, 'Successfully updated!');
    } catch (err) {
      unprocessableEntityResponse(res);
    }
  },

  async deleteCategoryDetails(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id)
        return unprocessableEntityResponse(res, 'Category Id is Required!');

      const category = await findCategoryById(id);
      if (!category) return notFoundErrorResponse(res, 'Category not found');

      await deleteCategory(id);
      successResponse(res, null, 'Successfully deleted!');
    } catch (err) {
      unprocessableEntityResponse(res);
    }
  },
};
