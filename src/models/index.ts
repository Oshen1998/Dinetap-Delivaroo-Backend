import { Sequelize } from 'sequelize';
import { initUser } from './user';
import { initRestaurant } from './restaurant';
import { initCategory } from './category';
import { initDish } from './dish';
import { initOrder } from './order';
import { initOrderItem } from './orderItem';
import { initRefreshToken } from './refreshToken';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'deliveroo_dev',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'pass',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);


export const models = {
  User: initUser(sequelize),
  Restaurant: initRestaurant(sequelize),
  Category: initCategory(sequelize),
  Dish: initDish(sequelize),
  Order: initOrder(sequelize),
  OrderItem: initOrderItem(sequelize),
  RefreshToken: initRefreshToken(sequelize)
};

// associations
const { User, Restaurant, Category, Dish, Order, OrderItem, RefreshToken } = models;

Restaurant.hasMany(Category, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
Category.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Category.hasMany(Dish, { onDelete: 'CASCADE' });
Dish.belongsTo(Category);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

Dish.hasMany(OrderItem);
OrderItem.belongsTo(Dish);

// Refresh token belongs to user
User.hasMany(RefreshToken, { onDelete: 'CASCADE' });
RefreshToken.belongsTo(User);

export { Sequelize };
