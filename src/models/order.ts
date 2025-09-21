import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface OrderAttributes {
  id: number;
  userId: number;
  restaurantId: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface OrderCreation extends Optional<OrderAttributes, 'id' | 'status'> {}

export class Order
  extends Model<OrderAttributes, OrderCreation>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number;
  public restaurantId!: number;
  public totalPrice!: number;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';

  static associate(models: any) {
    Order.belongsTo(models.Restaurant, {
      foreignKey: 'restaurantId',
      as: 'restaurant',
    });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  }
}

export const initOrder = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      restaurantId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      totalPrice: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
    },
    { sequelize, tableName: 'orders' }
  );

  return Order;
};
