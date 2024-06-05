import { UserRoutes } from "@routes/user.routes";
import { ValidationRoutes } from "@routes/validation.routes";
import express from "express";

const router = express.Router();

router.use("/validate", ValidationRoutes);
router.use("/users", UserRoutes);

export { router as ApiRoutes };
