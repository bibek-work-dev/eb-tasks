import mongoose from "mongoose";

const connectDb = async (dbUrl: string) => {
  await mongoose.connect(dbUrl);
};

export default connectDb;
