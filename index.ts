import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { connectDB } from "@config/db";
import { env } from "@config/environment";
import { ClerkAuthMiddleware } from "@middleware/clerk-auth.middleware";
import { ApiRoutes } from "@routes/api.routes";
import express from "express";

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(
  "/api",
  [ClerkExpressRequireAuth(), ClerkAuthMiddleware.handleClerkAuthError],
  ApiRoutes,
);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { app };
