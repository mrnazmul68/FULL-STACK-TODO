import mongoose from "mongoose";
import { env } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("DB is connected successfully");
  } catch (error) {
    console.error(`DB connection faild. the error is: ${error.message}`);
    throw error;
  }
};
