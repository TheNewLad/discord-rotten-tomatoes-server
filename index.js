import express from "express";
import { env } from "./config.js";
import { connectDB } from "./config/db.js";
import { ApiRoutes } from "./routes/api.routes.js";

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use("/api", ApiRoutes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { app };
