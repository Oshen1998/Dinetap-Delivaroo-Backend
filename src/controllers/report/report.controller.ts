import { Request, Response } from "express";
import { Op } from "sequelize";
import { Order } from "../../models/order";
import { Restaurant } from "../../models/restaurant";
import { Dish } from "../../models/dish";
import { User } from "../../models/user";
import {
  serverErrorResponse,
  successResponse,
} from "../../middleware/response-handler.middleware";


export default {

  async salesReport(req: Request, res: Response) {
    try {
      const { from, to } = req.query;

      const where: any = {};
      if (from && to) {
        const fromDate = new Date(from as string);
        const toDate = new Date(to as string);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid date format. Please use YYYY-MM-DD format.",
          });
        }

        toDate.setHours(23, 59, 59, 999);

        where.createdAt = {
          [Op.between]: [fromDate, toDate],
        };
      }

      const report = await Order.findAll({
        where,
        attributes: [
          "restaurantId",
          [
            Order.sequelize!.fn("COUNT", Order.sequelize!.col("Order.id")),
            "totalOrders",
          ],
          [
            Order.sequelize!.fn(
              "SUM",
              Order.sequelize!.col("Order.totalPrice")
            ),
            "totalRevenue",
          ],
        ],
        include: [
          {
            model: Restaurant,
            attributes: ["id", "name"],
          },
        ],
        group: ["Order.restaurantId", "Restaurant.id"],
      });

      successResponse(res, report);
    } catch (err) {
      serverErrorResponse(res);
    }
  },


};
