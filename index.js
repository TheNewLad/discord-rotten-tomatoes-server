import express from "express";
import { env } from "./config.js";
import { connectDB } from "./config/db.js";
import { authorizeUserRoute } from "./routes/authorizeUserRoute.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api", authorizeUserRoute);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { app };
