import { UserController } from "#controllers/user.controllers";
import express from "express";

const router = express.Router();

router.get("/", UserController.authorizeUser);

export { router as UserRoutes };
