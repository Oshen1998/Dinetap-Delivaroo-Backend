import { Op, Sequelize } from 'sequelize';
import { ReportQuery } from '../common/interfaces/reports.interface';
import { models } from '../models';
import { Order } from '../models/order';

export const totalSalesByPeriod = async (
  period: 'day' | 'week' | 'month',
  query: ReportQuery
) => {
  try {
    const { status, startDate, endDate } = query;
    return await Order.findAll({
      attributes: [
        [
          Sequelize.fn(
            period === 'day'
              ? 'DATE'
              : period === 'week'
                ? 'YEARWEEK'
                : 'DATE_FORMAT',
            Sequelize.col('createdAt'),
            period === 'month' ? '%Y-%m-%d' : undefined
          ),
          'period',
        ],
        [Sequelize.fn('SUM', Sequelize.col('price')), 'totalSales'],
      ],
      where: {
        ...(status && { status: { [Op.in]: status } }),
        ...(startDate &&
          endDate && {
            createdAt: { [Op.between]: [startDate, endDate] },
          }),
      },
      group: ['period'],
      order: [['period', 'ASC']],
    });
  } catch (error) {
    console.error('Error in totalSalesByPeriod:', error);
    throw error;
  }
};

export const topSellingItems = async (
  metric: 'quantity' | 'revenue',
  query: ReportQuery
) => {
  try {
    const { status, startDate, endDate, sortOrder, page, limit } = query;

    const options: any = {
      attributes: [
        'dishId',
        [
          Sequelize.fn(
            'SUM',
            // Use Sequelize.col with the correct column path, which includes the alias
            Sequelize.col(
              metric === 'quantity' ? 'OrderItem.quantity' : 'OrderItem.price'
            )
          ),
          metric,
        ],
      ],
      include: [
        {
          model: models.Order,
          as: 'order',
          attributes: [],
          where: {
            ...(status && { status: { [Op.in]: status } }),
            ...(startDate &&
              endDate && {
                createdAt: { [Op.between]: [startDate, endDate] },
              }),
          },
        },
      ],
      group: ['dishId', 'order.id'],
      order: [[Sequelize.literal(metric), sortOrder || 'DESC']],
    };

    if (limit) {
      options.limit = limit;
      options.offset = page ? (page - 1) * limit : 0;
    }

    return await models.OrderItem.findAll(options);
  } catch (error) {
    console.error('Error in topSellingItems:', error);
    throw error;
  }
};
