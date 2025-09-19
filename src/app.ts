import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import { errorHandler } from "./middleware/error.middleware";
import { sequelize } from "./models";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);

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
