// Connect to MongoDB
import mongoose from "mongoose";
import { env } from "../config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
