import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { env } from "@config/environment";
import { ClerkAuthMiddleware } from "@middleware/clerk-auth.middleware";
import { responseTime } from "@middleware/reponse-time.middleware";
import { ApiRoutes } from "@routes/api.routes";
import cors from "cors";
import express from "express";

const app = express();

// Middleware
const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(responseTime);
app.use(
  "/api",
  [ClerkExpressRequireAuth(), ClerkAuthMiddleware.handleClerkAuthError],
  ApiRoutes,
);
app.settings;

// Start server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { app };
