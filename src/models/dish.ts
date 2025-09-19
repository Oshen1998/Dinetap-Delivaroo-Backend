import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface DishAttributes {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
}

export interface DishCreationAttributes extends Optional<DishAttributes, 'id'> {}

export class Dish extends Model<DishAttributes, DishCreationAttributes> implements DishAttributes {
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public image?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initDish(sequelize: Sequelize) {
  Dish.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      image: { type: DataTypes.STRING(1024), allowNull: true }
    },
    {
      tableName: 'dishes',
      sequelize
    }
  );
  return Dish;
}
