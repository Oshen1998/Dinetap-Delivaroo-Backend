import { Request, Response } from 'express';
import {
  badRequestResponse,
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import {
  allDishes,
  createDish,
  deleteDish,
  findDishById,
  updateDish,
} from '../services/dish.service';
import {
  createDishSchema,
  updateDishSchema,
} from '../validations/dish.validation';

export default {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['size'] as string) || 20;
      const offset = (page - 1) * limit;

      const dishes = await allDishes(limit, offset);

      successResponse(res, {
        dishes,
        page: page,
        count: dishes?.length || 0,
        size: limit,
      });
    } catch (err) {
      return serverErrorResponse(res);
    }
  },

  async createNewDish(req: Request, res: Response) {
    try {
      const parsed = createDishSchema.safeParse(req.body);

      if (!parsed.success) {
        return badRequestResponse(res, parsed.error.errors.toString());
      }

      const newDish = await createDish(parsed.data);
      successResponse(res, newDish, 'Dish successfully created!');
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },

  async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return badRequestResponse(res, 'Dish ID is required.');
      }

      const dish = await findDishById(id);

      if (!dish) {
        return notFoundErrorResponse(res, 'Dish not found.');
      }

      successResponse(res, dish);
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },

  async updateDishDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return badRequestResponse(res, 'Dish ID is required.');
      }

      const parsed = updateDishSchema.safeParse(req.body);

      if (!parsed.success) {
        return badRequestResponse(res, parsed.error.errors.toString());
      }

      const dish = await findDishById(id);
      if (!dish) {
        return notFoundErrorResponse(res, 'Dish not found.');
      }

      const updatedDish = await updateDish(parsed.data, id);
      successResponse(res, updatedDish);
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },

  async deleteDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return badRequestResponse(res, 'Dish ID is required.');
      }

      const dish = await findDishById(id);
      if (!dish) {
        return notFoundErrorResponse(res, 'Dish not found.');
      }

      const deleted = await deleteDish(id);
      if (deleted[0] === 0) {
        return notFoundErrorResponse(res, 'Failed to delete dish.');
      }

      successResponse(res, null, 'Dish successfully deleted.');
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },
};
