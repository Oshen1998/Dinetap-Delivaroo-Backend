import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface RestaurantAttributes {
  id: number;
  name: string;
  description?: string | null;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantCreationAttributes extends Optional<RestaurantAttributes, 'id'> {}

export class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
  public id!: number;
  public name!: string;
  public description?: string | null;
  public address?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initRestaurant(sequelize: Sequelize) {
  Restaurant.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      address: { type: DataTypes.STRING(512), allowNull: true }
    },
    {
      tableName: 'restaurants',
      sequelize
    }
  );
  return Restaurant;
}
