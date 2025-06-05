import express from "express";
import userRoutes from "./routes/user.route";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/api/v1/", userRoutes);

export default app;
