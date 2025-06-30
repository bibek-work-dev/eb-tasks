import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://root:root@cluster0.pk7jrn5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

export default connectToDB;
