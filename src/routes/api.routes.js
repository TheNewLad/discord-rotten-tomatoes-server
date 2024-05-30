import { UserRoutes } from "#routes/user.routes";
import express from "express";

const router = express.Router();

router.use("/users", UserRoutes);

export { router as ApiRoutes };
