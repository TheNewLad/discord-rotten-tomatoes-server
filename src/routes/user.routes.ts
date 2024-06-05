import { UserController } from "#controllers/user.controllers";
import express from "express";

const router = express.Router();

router.post("/", UserController.validateUser);

export { router as UserRoutes };
