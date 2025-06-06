import mongoose from "mongoose";

const connectDb = async (dbUrl: string): Promise<any> => {
  await mongoose.connect(dbUrl);
};

export default connectDb;
