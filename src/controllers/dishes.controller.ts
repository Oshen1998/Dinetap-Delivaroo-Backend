import { Request, Response } from 'express';
import { CategoryWithDishes } from '../common/types';
import {
  badRequestResponse,
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import { models } from '../models';
import { Dish, DishStatus } from '../models/dish';
import {
  allDishes,
  createDish,
  deleteDish,
  findDishById,
  updateDish,
} from '../services/dish.service';
import { generateRandomEmoji, generateRandomNumber } from '../utils';
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

  async RestaurantWiseDishes(req: Request, res: Response) {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return unprocessableEntityResponse(
        res,
        'restaurantId query parameter is required.'
      );
    }

    try {
      const categoriesWithDishes = (await models.Category.findAll({
        where: { restaurantId: Number(restaurantId) },
        include: [
          {
            model: models.Dish,
            as: 'dishes',
            where: { status: DishStatus.AVAILABLE },
            required: false,
          },
        ],
        order: [
          ['name', 'ASC'],
          [{ model: models.Dish, as: 'dishes' }, 'name', 'ASC'],
        ],
      })) as unknown as CategoryWithDishes[];

      const formattedResponse = categoriesWithDishes.map(category => {
        const categoryData = category.toJSON();

        const dishes = Array.isArray(categoryData.dishes)
          ? categoryData.dishes.map((dish: Dish, index: number) => ({
              dishId: dish.id,
              dishName: dish.name,
              dishRate: dish.rate ?? 0,
              price: dish.price,
              currency: 'LKR',
              calories: `${generateRandomNumber(30, 120)} kcal`,
              description: dish?.description,
              imageId: generateRandomNumber(1, 10),
              tags: dish?.tags && index !== 0 && index / 3 ? dish.tags[0] : '',
            }))
          : [];

        return {
          categoryId: categoryData.id,
          categoryName: generateRandomEmoji(categoryData.name),
          dishes: dishes,
        };
      });

      if (!formattedResponse || formattedResponse.length === 0) {
        return res.status(404).json({
          message: 'No categories or dishes found for this restaurant.',
        });
      }

      res.status(200).json(formattedResponse);
    } catch (error) {
      console.error('Error fetching categories and dishes:', error);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  },
};
