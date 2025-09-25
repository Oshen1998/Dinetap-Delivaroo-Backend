import { Request, Response } from 'express';
import {
  badRequestResponse,
  notFoundErrorResponse,
  serverErrorResponse,
  successResponse,
  unprocessableEntityResponse,
} from '../middleware/response-handler.middleware';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getRestaurantWiseOrders,
} from '../services/order.service';
import {
  orderCreationSchema,
  orderIdSchema,
} from '../validations/order.validation';

export default {
  async createOrder(req: Request, res: Response) {
    try {
      const validatedData = orderCreationSchema.parse(req.body);
      const newOrder = await createOrder(validatedData);
      successResponse(res, newOrder);
    } catch (error) {
      if (error instanceof Error) badRequestResponse(res, error.message);
    }
  },

  async getAllOrders(req: Request, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['size'] as string) || 10;

      const orders = await getAllOrders(page, limit);

      successResponse(res, orders);
    } catch (error) {
      if (error instanceof Error) serverErrorResponse(res, error.message);
    }
  },

  async getAllRestaurantWiseOrders(req: Request, res: Response) {
    try {
      const restaurantId = req.params['id'];
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['size'] as string) || 10;

      const orders = await getRestaurantWiseOrders(
        page,
        limit,
        Number(restaurantId)
      );
      successResponse(res, orders);
    } catch (error) {
      if (error instanceof Error) serverErrorResponse(res, error.message);
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = orderIdSchema.parse(req.params);
      const order = await getOrderById(id);
      if (order) {
        successResponse(res, order);
      } else {
        notFoundErrorResponse(res, 'Order not found');
      }
    } catch (error) {
      if (error instanceof Error) badRequestResponse(res, error.message);
    }
  },

  // This is Hard Delete - Usually We are not doing this
  async deleteOrder(req: Request, res: Response) {
    try {
      const validatedData = orderIdSchema.parse({
        id: Number(req.params['id']),
      });

      if (!validatedData) {
        unprocessableEntityResponse(res, 'Not a Valid Id');
      }
      await deleteOrder(validatedData.id);
      successResponse(res, 'Successfully Deleted!');
    } catch (error) {
      console.log(error);

      badRequestResponse(res);
    }
  },
};
