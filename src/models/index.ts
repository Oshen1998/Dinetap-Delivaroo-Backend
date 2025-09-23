import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { initCategory } from './category';
import { initDish } from './dish';
import { initOrder } from './order';
import { initOrderItem } from './orderItem';
import { initRefreshToken } from './refreshToken';
import { initRestaurant } from './restaurant';
import { initUser } from './user';
dotenv.config();

export const sequelize = new Sequelize(
  process.env['DB_NAME'] || 'deliveroo_dev',
  process.env['DB_USER'] || 'root',
  process.env['DB_PASS'] || 'pass',
  {
    host: process.env['DB_HOST'] || '127.0.0.1',
    port: Number(process.env['DB_PORT'] || 3306),
    dialect: 'mysql',
    logging: false,
  }
);

export const models = {
  User: initUser(sequelize),
  Restaurant: initRestaurant(sequelize),
  Category: initCategory(sequelize),
  Dish: initDish(sequelize),
  Order: initOrder(sequelize),
  OrderItem: initOrderItem(sequelize),
  RefreshToken: initRefreshToken(sequelize),
};

// associations
const { User, Restaurant, Category, Dish, Order, OrderItem, RefreshToken } =
  models;

export function setupAssociations() {
  // Restaurant <-> Category (One-to-Many)
  // A restaurant can have multiple categories
  Restaurant.hasMany(Category, {
    foreignKey: 'restaurantId',
    as: 'categories',
    onDelete: 'CASCADE',
  });
  Category.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  // Category <-> Dish (One-to-Many)
  // A category can have multiple dishes
  Category.hasMany(Dish, {
    foreignKey: 'categoryId',
    as: 'dishes',
    onDelete: 'CASCADE',
  });
  Dish.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
  });

  // Restaurant <-> Dish (One-to-Many)
  // A restaurant can have multiple dishes
  Restaurant.hasMany(Dish, {
    foreignKey: 'restaurantId',
    as: 'dishes',
    onDelete: 'CASCADE',
  });
  Dish.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  // User <-> Order (One-to-Many)
  // A user can have multiple orders
  User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE',
  });
  Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Restaurant <-> Order (One-to-Many)
  // A restaurant can have multiple orders
  Restaurant.hasMany(Order, {
    foreignKey: 'restaurantId',
    as: 'orders',
    onDelete: 'CASCADE',
  });
  Order.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
  });

  // Order <-> OrderItem (One-to-Many)
  // An order can have multiple order items
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  // Dish <-> OrderItem (One-to-Many)
  // A dish can be in multiple order items
  Dish.hasMany(OrderItem, {
    foreignKey: 'dishId',
    as: 'orderItems',
  });
  OrderItem.belongsTo(Dish, {
    foreignKey: 'dishId',
    as: 'dish',
  });

  // User <-> RefreshToken (One-to-Many)
  // A user can have multiple refresh tokens
  User.hasMany(RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshTokens',
    onDelete: 'CASCADE',
  });
  RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Many-to-Many through OrderItem
  // User <-> Dish (through Order and OrderItem)
  User.belongsToMany(Dish, {
    through: {
      model: OrderItem,
      scope: {},
    },
    foreignKey: 'orderId',
    otherKey: 'dishId',
    as: 'orderedDishes',
  });

  Dish.belongsToMany(User, {
    through: {
      model: OrderItem,
      scope: {},
    },
    foreignKey: 'dishId',
    otherKey: 'orderId',
    as: 'customers',
  });
}

setupAssociations();

export { Sequelize };
