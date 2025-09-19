import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import authRoutes from "./routes/auth.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import dishesRoutes from "./routes/dishes.routes";
import categoryRoutes from "./routes/categories.route";
import reportRoutes from "./routes/reports.routes";
import { errorHandler } from "./middleware/error.middleware";
import { sequelize } from "./models";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishesRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/reports", reportRoutes);

// health
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.use(errorHandler);

// ensure DB connect
export async function initApp() {
  await sequelize.authenticate().then(() => {
    console.log("Database Connected Successfully!");
  });
  return app;
}

export default app;
