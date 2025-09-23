import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum DishStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum DishTags {
  VEG = 'VEG',
  VEGAN = 'VEGAN',
  NEW = 'NEW',
}

type TagArray = string[];

interface DishAttributes {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null | undefined;
  price: number;
  image?: string | null;
  tags: TagArray | undefined;
  isAvailable: boolean | undefined;
  isPopular: boolean | undefined;
  status: DishStatus | undefined;
  rate?: number | null | undefined;
  restaurantId: number;
}

export interface DishCreationAttributes
  extends Optional<
    DishAttributes,
    'id' | 'tags' | 'isAvailable' | 'isPopular' | 'rate' | 'status'
  > {}

export class Dish
  extends Model<DishAttributes, DishCreationAttributes>
  implements DishAttributes
{
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public description?: string | null;
  public price!: number;
  public image?: string | null;
  public tags!: TagArray | undefined;
  public isAvailable!: boolean | undefined;
  public isPopular!: boolean | undefined;
  public status!: DishStatus | undefined;
  public rate?: number | null | undefined;
  public restaurantId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initDish(sequelize: Sequelize) {
  Dish.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM<DishStatus>(
          DishStatus.AVAILABLE,
          DishStatus.UNAVAILABLE
        ),
        allowNull: false,
        defaultValue: DishStatus.AVAILABLE,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      restaurantId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'restaurants',
          key: 'id',
        },
      },
    },
    {
      tableName: 'dishes',
      sequelize,
      indexes: [
        {
          fields: ['categoryId'],
        },
        {
          fields: ['name'],
        },
        {
          fields: ['restaurantId'],
        },
      ],
    }
  );
  return Dish;
}
