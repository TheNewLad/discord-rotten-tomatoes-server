import { validateUser } from "@controllers/user.controllers";
import express from "express";

const router = express.Router();

router.post("/", validateUser);

export { router as UserRoutes };
