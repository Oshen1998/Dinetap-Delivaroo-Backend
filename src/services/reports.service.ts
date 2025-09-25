import { Op, Sequelize } from 'sequelize';
import { ReportQuery } from '../common/interfaces/reports.interface';
import { Order } from '../models/order';
import { OrderItem } from '../models/orderItem';

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
            Sequelize.col(metric === 'quantity' ? 'quantity' : 'price')
          ),
          metric,
        ],
      ],
      include: [
        {
          model: Order,
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
      group: ['dishId'],
      order: [[Sequelize.literal(metric), sortOrder || 'DESC']],
    };

    if (limit) {
      options.limit = limit;
      options.offset = page ? (page - 1) * limit : 0;
    }

    return await OrderItem.findAll(options);
  } catch (error) {
    console.error('Error in topSellingItems:', error);
    throw error;
  }
};
