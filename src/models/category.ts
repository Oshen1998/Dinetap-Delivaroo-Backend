import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface CategoryAttributes {
  id: number;
  restaurantId: number;
  name: string;
  position?: number;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public restaurantId!: number;
  public name!: string;
  public position?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initCategory(sequelize: Sequelize) {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      restaurantId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'categories',
      sequelize,
    }
  );
  return Category;
}
