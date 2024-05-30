import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const { action } = req.query;
  if (action === "authorize") {
    res.json("Authorize user");
  } else {
    res.status(204).end(); // No Content
  }
});

router.get("/:userId", (req, res) => {
  console.log("UserModel ID: ", req.params.userId);
  res.json(`User ID: ${req.params.userId}`);
});

export { router as userRoutes };
