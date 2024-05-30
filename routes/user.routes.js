import express from "express";
import { UserController } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/", UserController.authorizeUser);

export { router as UserRoutes };
