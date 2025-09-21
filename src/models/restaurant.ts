import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

type TagArray = string[];
export type RestaurantStatus = 'ACTIVE' | 'INACTIVE';

interface RestaurantAttributes {
  id: number;
  name: string;
  status: RestaurantStatus;
  description?: string | null | undefined;
  address?: string | null | undefined;
  currencyCode?: string | undefined;
  tags?: TagArray | undefined;
  rate?: number | null | undefined;
  long?: number | null | undefined;
  lat?: number | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

// 💡 Corrected: Add 'long' and 'lat' to the list of optional attributes
export interface RestaurantCreationAttributes
  extends Optional<
    RestaurantAttributes,
    | 'id'
    | 'description'
    | 'address'
    | 'currencyCode'
    | 'tags'
    | 'rate'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'long'
    | 'lat'
  > {}

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes
{
  public id!: number;
  public name!: string;
  public description?: string | null;
  public currencyCode?: string;
  public tags?: TagArray;
  public status!: RestaurantStatus;
  public address?: string | null;
  public rate?: number | null;
  public long?: number | null;
  public lat?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initRestaurant(sequelize: Sequelize) {
  Restaurant.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      address: { type: DataTypes.STRING(512), allowNull: true },
      currencyCode: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM<RestaurantStatus>('ACTIVE', 'INACTIVE'),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      long: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      lat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      tableName: 'restaurants',
      sequelize,
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
}
