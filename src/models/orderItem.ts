import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  dishId: number;
  quantity: number;
  price: number;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public dishId!: number;
  public quantity!: number;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initOrderItem(sequelize: Sequelize) {
  OrderItem.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      dishId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 }
    },
    {
      tableName: 'order_items',
      sequelize
    }
  );
  return OrderItem;
}
