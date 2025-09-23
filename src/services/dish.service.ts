import { z } from 'zod';
import { models } from '../models';
import { DishCreationAttributes, DishStatus } from '../models/dish';
import { removeUndefined } from '../utils';
import {
  createDishSchema,
  updateDishSchema,
} from '../validations/dish.validation';

export const createDish = async (body: z.infer<typeof createDishSchema>) => {
  const sanitizedBody = removeUndefined(body);
  return await models.Dish.create(sanitizedBody as DishCreationAttributes);
};

export const allDishes = async (limit: number, offset: number) => {
  return await models.Dish.findAll({ limit, offset });
};

export const findDishById = async (id: string | number) => {
  return await models.Dish.findByPk(id);
};

export const findByRestaurantQueryParam = async (id: string | number) => {
  return await models.Dish.findOne({ where: { restaurantId: id } });
};

export const updateDish = async (
  body: z.infer<typeof updateDishSchema>,
  id: string | number
) => {
  const sanitizedBody = removeUndefined(body);
  return await models.Dish.update(
    sanitizedBody as Partial<DishCreationAttributes>,
    {
      where: { id },
    }
  );
};

export const deleteDish = async (id: string | number) => {
  return await models.Dish.update(
    { status: DishStatus.UNAVAILABLE },
    {
      where: { id },
    }
  );
};
