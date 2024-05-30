import { connectDB } from "#config/db";
import { env } from "#config/environment";
import { ApiRoutes } from "#routes/api.routes";
import express from "express";

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
