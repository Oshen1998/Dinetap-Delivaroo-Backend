import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { HTTP_STATUS_CODES } from './common/constants';
import { errorHandler } from './middleware/error.middleware';
import { sequelize } from './models';
import authRoutes from './routes/routes-v1/auth.routes';
import categoryRoutes from './routes/routes-v1/categories.route';
import dishesRoutes from './routes/routes-v1/dishes.routes';
import orderRoutes from './routes/routes-v1/order.routes';
import reportRoutes from './routes/routes-v1/reports.routes';
import restaurantRoutes from './routes/routes-v1/restaurant.routes';
dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/orders', orderRoutes);

// health
app.get('/', (req, res) => res.status(HTTP_STATUS_CODES.OK).json({ ok: true }));

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/api/v1', '/'],
  });
});

app.use(errorHandler);

// ensure DB connect
export async function initApp() {
  await sequelize.authenticate().then(() => {
    console.log('Database Connected Successfully!');
  });
  return app;
}

export default app;
