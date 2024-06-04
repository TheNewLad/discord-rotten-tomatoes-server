import { UserController } from "#controllers/user.controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import express from "express";

const router = express.Router();

router.get("/", [ClerkExpressRequireAuth()], UserController.authorizeUser);

export { router as UserRoutes };
