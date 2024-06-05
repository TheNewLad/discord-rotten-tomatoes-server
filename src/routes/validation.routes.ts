import { UserController } from "@controllers/user.controllers";
import express from "express";

const router = express.Router();

router.get("/", UserController.validateUser);

export { router as ValidationRoutes };
