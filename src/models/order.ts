import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface OrderAttributes {
  id: number;
  userId: number;
  status: 'pending' | 'completed' | 'cancelled' | 'preparing' | 'delivered';
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public status!: 'pending' | 'completed' | 'cancelled' | 'preparing' | 'delivered';
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initOrder(sequelize: Sequelize) {
  Order.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'preparing', 'delivered'), defaultValue: 'pending' },
      total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 }
    },
    {
      tableName: 'orders',
      sequelize
    }
  );
  return Order;
}
