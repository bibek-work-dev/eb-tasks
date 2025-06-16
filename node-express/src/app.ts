import express, { ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import followerRoutes from "./routes/follower.route";
import eventRoutes from "./routes/event.route";
import { emailJob } from "./jobs/email.job";
import notificationRoutes from "./routes/notification.route";

const app = express();

// middlewares
app.use(express.json());

emailJob();

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/followers", followerRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/notifications", notificationRoutes);

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
