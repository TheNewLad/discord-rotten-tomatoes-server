import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/check-profile/:supabaseId", async (req, res) => {
  const { supabaseId } = req.params;
  try {
    const user = await User.findOne({ supabaseId });
    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/find/:discordUserId", async (req, res) => {
  const { discordUserId } = req.params;
  try {
    const user = await User.findOne({ supabaseId: discordUserId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//check if user is onboarded
router.get("/onboard/:discordUserId", async (req, res) => {
  const { discordUserId } = req.params;
  try {
    const user = await User.findOne({ discordUserId });
    if (user) {
      res.json({ onboarded: user.onboarded });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/onboard", async (req, res) => {
  const { discordUserId, reviewWeights } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { discordUserId },
      { reviewWeights, onboarded: true },
      { new: true, fields: ["onboarded"] },
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export { router as userRoutes };
