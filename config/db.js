// Connect to MongoDB
import { env } from "#config/environment.js";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
