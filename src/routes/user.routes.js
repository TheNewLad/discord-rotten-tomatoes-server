import { UserController } from "#controllers/user.controllers";
import { authenticateRequest, getBearerToken } from "#middleware/";
import express from "express";

const router = express.Router();

router.get(
  "/",
  [authenticateRequest, getBearerToken],
  UserController.authorizeUser,
);

export { router as UserRoutes };
