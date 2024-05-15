import express from "express";
import mongoose from "mongoose";
import { env } from "./config.js";
import authorizeUserRoute from "./routes/authorizeUserRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use("/auth/callback", discordRoutes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

// Connect to MongoDB
const dbURI = env.MONGODB_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
