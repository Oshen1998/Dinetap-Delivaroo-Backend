import { models } from '../models';
import { IRestaurant, Restaurant } from '../models/restaurant';

export const createRestaurant = async (body: IRestaurant) => {
  return await models.Restaurant.create({
    ...body,
  });
};

export const findRestaurantById = async (id: string | number) => {
  return await models.Restaurant.findByPk(id);
};

export const updateRestaurant = async (
  body: Restaurant,
  id: string | number
) => {
  return await models.Restaurant.update(body, {
    where: { id },
  });
};

export const deleteRestaurant = async (id: string | number) => {
  return await models.Restaurant.update(
    { status: 'INACTIVE' },
    {
      where: { id },
    }
  );
};
