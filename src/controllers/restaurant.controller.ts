import { Request, Response } from 'express';

import {
  badRequestResponse,
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import { Restaurant } from '../models/restaurant';
import {
  createRestaurant,
  deleteRestaurant,
  findRestaurantById,
  updateRestaurant,
} from '../services/restaurant.service';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from '../validations/restaurant.validation';

export default {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const offset = (page - 1) * limit;

      const { rows: restaurants, count } = await Restaurant.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      successResponse(res, {
        data: restaurants,
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
      const restaurant = await Restaurant.findByPk(req.params['id']);
      if (!restaurant) return notFoundErrorResponse(res);
      return successResponse(res, restaurant);
    } catch (err) {
      return serverErrorResponse(res, 'Failed to fetch restaurant');
    }
  },

  async addNewRestaurant(req: Request, res: Response) {
    try {
      const parsed = createRestaurantSchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const restaurant = await createRestaurant(parsed.data);
      successResponse(res, restaurant, 'Successfully Created!');
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },

  async updateRestaurantDetails(req: Request, res: Response) {
    try {
      const parsed = updateRestaurantSchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const id = req.params['id'];
      if (!id)
        return unprocessableEntityResponse(res, 'Restaurant Id is Required!');

      const restaurant = await findRestaurantById(id);

      if (!restaurant) return notFoundErrorResponse(res, 'Not Found');

      const updated = await updateRestaurant(req.body, id);
      successResponse(res, updated);
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },

  async deleteRestaurantById(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id)
        return unprocessableEntityResponse(res, 'Restaurant Id is Required!');

      const restaurant = await findRestaurantById(id);
      if (!restaurant) return notFoundErrorResponse(res, 'Not Found');

      const deleted = await deleteRestaurant(id);
      if (deleted[0] === 0) {
        return notFoundErrorResponse(res, 'Not Found');
      }

      successResponse(res, null, 'Restaurant successfully deleted!');
      return;
    } catch (err) {
      unprocessableEntityResponse(res);
      return;
    }
  },
};
