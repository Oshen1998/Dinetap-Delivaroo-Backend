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

  async create(req: Request, res: Response) {
    try {
      const parsed = createRestaurantSchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const { name, address, description } = parsed.data;
      const restaurant = await Restaurant.create({
        name,
        address,
        description: description ?? null,
      });
      return successResponse(res, restaurant, 'Successfully Created!');
    } catch (err) {
      return unprocessableEntityResponse(res);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const parsed = updateRestaurantSchema.safeParse(req.body);

      if (!parsed.success)
        return badRequestResponse(res, parsed.error.toString());

      const restaurant = await Restaurant.findByPk(req.params['id']);

      if (!restaurant) return notFoundErrorResponse(res, 'Not Found');
      await restaurant.update(req.body);
      return successResponse(res, restaurant);
    } catch (err) {
      return unprocessableEntityResponse(res);
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const restaurant = await Restaurant.findByPk(req.params['id']);
      if (!restaurant) return notFoundErrorResponse(res, 'Not Found');
      await restaurant.destroy();
      res.status(204).send();
    } catch (err) {
      serverErrorResponse(res);
    }
  },
};
