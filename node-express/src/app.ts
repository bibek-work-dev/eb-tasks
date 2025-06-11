import express, { ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import followerRoutes from "./routes/follower.route";
import eventRoutes from "./routes/event.route";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/followers", followerRoutes);
app.use("/api/v1/events", eventRoutes);

// bibekkoirala2058
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4ZjNjNzdkMTRlMjQzN2QzNjNiNGUiLCJlbWFpbCI6Ind3dy5iaWJla2tvaXJhbGEyMDU4QGdtYWlsLmNvbSIsImlhdCI6MTc0OTYxMTU3NywiZXhwIjoxNzQ5Njk3OTc3fQ.7yvhuDHtg6NlCr-LREE0rCyNN6s9krdqJg9cyBhCVg4
// culturaarcher23058
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4ZjM5MTdkMTRlMjQzN2QzNjNiNDkiLCJlbWFpbCI6Ind3dy5jdWx0dXJhbGFyY2hlcjIwNThAZ21haWwuY29tIiwiaWF0IjoxNzQ5NjExNTAyLCJleHAiOjE3NDk2OTc5MDJ9.fy3uDM8Y0W9IY8ZuQq-L-tnWHC9zgozGVejU5x5hbBI

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
