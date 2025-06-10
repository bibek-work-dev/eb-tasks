import express, { ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import followerRoutes from "./routes/follower.route";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/followers", followerRoutes);

// koiralabibek2058
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4MGVmMjA0YzZhZWIwN2M2NDAzYTYiLCJlbWFpbCI6ImtvaXJhbGFiaWJlazIwNThAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUyOTg3LCJleHAiOjE3NDk2MzkzODd9.xxlHLownqJizmey6NcuY2vLKasexl-qTGIIFVIyNsCI
// culturaarcher23058
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4MGYzMjA0YzZhZWIwN2M2NDAzYWIiLCJlbWFpbCI6Ind3dy5jdWx0dXJhbGFyY2hlcjIwNThAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUzMDQzLCJleHAiOjE3NDk2Mzk0NDN9.PmFCesCP6kRYnsoU0VAL4ii1PXYwrjcjvlsPMxOMUG0

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
