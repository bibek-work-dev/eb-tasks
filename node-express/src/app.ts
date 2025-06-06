import express, { ErrorRequestHandler, RequestHandler } from "express";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { ErrorHandlingMiddlewareFunction } from "mongoose";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/api/v1/", userRoutes);

// app.use((req, res, next) => {
//   console.log("yeha");
//   next();
// });

app.use(errorMiddleware as ErrorRequestHandler);

export default app;
