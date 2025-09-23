import { z } from 'zod';
import { models } from '../models';
import { CategoryCreationAttributes } from '../models/category';
import { removeUndefined } from '../utils';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation';

export const createCategory = async (
  body: z.infer<typeof createCategorySchema>
) => {
  const sanitizedBody = removeUndefined(body);
  return await models.Category.create(
    sanitizedBody as CategoryCreationAttributes
  );
};

export const findCategoryById = async (id: string | number) => {
  return await models.Category.findByPk(id);
};

export const updateCategory = async (
  body: z.infer<typeof updateCategorySchema>,
  id: string | number
) => {
  const sanitizedBody = removeUndefined(body);
  return await models.Category.update(
    sanitizedBody as Partial<CategoryCreationAttributes>,
    {
      where: { id },
    }
  );
};

export const deleteCategory = async (id: string | number) => {
  return await models.Category.destroy({
    where: { id },
  });
};

export const getCategoryDishesWithPagination = async (
  categoryId: string | number,
  limit: number,
  offset: number
) => {
  return await models.Dish.findAndCountAll({
    where: { categoryId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};
