import { Order } from '../models/order';
import { OrderItem } from '../models/orderItem';
import { Restaurant } from '../models/restaurant';

export const createOrder = async (orderData: {
  userId: number;
  restaurantId: number;
  price: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    throw new Error(`Failed to create order: ${error}`);
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
        },
        {
          model: OrderItem,
          as: 'items',
        },
      ],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    throw new Error(`Failed to get order: ${error}`);
  }
};

export const getOrdersByUserId = async (userId: number) => {
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
        },
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return orders;
  } catch (error) {
    throw new Error(`Failed to get user orders: ${error}`);
  }
};

export const getOrdersByRestaurantId = async (restaurantId: number) => {
  try {
    const orders = await Order.findAll({
      where: { restaurantId },
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return orders;
  } catch (error) {
    throw new Error(`Failed to get restaurant orders: ${error}`);
  }
};

export const updateOrderStatus = async (
  id: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
) => {
  try {
    const [updatedRowsCount] = await Order.update(
      { status },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      throw new Error('Order not found');
    }

    const updatedOrder = await getOrderById(id);
    return updatedOrder;
  } catch (error) {
    throw new Error(`Failed to update order status: ${error}`);
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const deletedRowsCount = await Order.destroy({ where: { id } });

    if (deletedRowsCount === 0) {
      throw new Error('Order not found');
    }

    return { message: 'Order deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete order: ${error}`);
  }
};

export const getAllOrders = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
        },
        {
          model: OrderItem,
          as: 'items',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      orders: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to get all orders: ${error}`);
  }
};
