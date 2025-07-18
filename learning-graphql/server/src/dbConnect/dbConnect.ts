import "../config/env.js";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
async function connectToDB(): Promise<void> {
  try {
    // console.log("mongoURI", MONGO_URI);
    if (!MONGO_URI) {
      throw new Error("Something went wrong");
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

export default connectToDB;
