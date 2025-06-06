import "dotenv/config";
import connectDb from "./src/config/connectDb";
import app from "./src/app";
const PORT = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URI ? process.env.MONGO_URI : "";

connectDb(dbUrl)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is listening in PORT ${PORT} `);
    });
    process.on("uncaughtException", () => {
      console.log("error happened");
      process.exit(1);
    });
    process.on("unhandledRejection", () => {
      console.log("unhandled rejection");
      process.exit(1);
    });
  })
  .catch((error: any) => {
    console.log("Something went wrong");
  });
