import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
dotenv.config();

const config = {
  development: {
    username: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASS'] || 'secret',
    database: process.env['DB_NAME'] || 'delivaroo',
    host: process.env['DB_HOST'] || '127.0.0.1',
    port: Number(process.env['DB_PORT'] || 3306),
    dialect: 'mysql' as Dialect,
    logging: false,
  },
  test: {
    username: process.env['DB_USER'],
    password: process.env['DB_PASS'],
    database: process.env['DB_NAME'],
    host: process.env['DB_HOST'] || '127.0.0.1',
    port: Number(process.env['DB_PORT'] || 3306),
    dialect: 'mysql' as Dialect,
    logging: false,
  },
  production: {
    username: process.env['DB_USER'],
    password: process.env['DB_PASS'],
    database: process.env['DB_NAME'],
    host: process.env['DB_NAME'],
    port: Number(process.env['DB_PORT'] || 3306),
    dialect: 'mysql' as Dialect,
    logging: false,
  },
};

export = config;
