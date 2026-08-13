import express from "express";
import cors from "cors";
import helmet from "helmet";
import FoodRoutes from "./routes/fooditem.route"
import OrderRoutes from "./routes/order.routes"
import { env } from "./config/env";
import rateLimit from "express-rate-limit";

const app = express();
const allowedOrigin = env.FRONTEND_URI;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});


// Helmet adds several HTTP security headers.
app.use(helmet());
// only allowed required origin
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Without a reasonable limit, someone could send an unnecessarily huge JSON payload to your API.
app.use(express.json({ limit: "200kb" }));


app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.use("/api", apiLimiter);
app.use("/api/food",FoodRoutes)
app.use("/api/order",OrderRoutes)

export default app;