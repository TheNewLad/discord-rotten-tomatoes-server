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

router.post("/onboard", async (req, res) => {
  const {
    username,
    supabaseId,
    discordId,
    reviewWeights = {
      plot: 10,
      acting: 10,
      visuals: 10,
      audio: 10,
      pacing: 10,
    },
  } = req.body;
  try {
    const user = new User({ username, supabaseId, discordId, reviewWeights });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as userRoutes };
