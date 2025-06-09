import express, { ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

app.use(errorMiddleware as ErrorRequestHandler);

// Example of a custom middleware
app.use((req, res, next) => {
  console.log("yeha");
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
    error: "Not Found",
  });
});

export default app;
