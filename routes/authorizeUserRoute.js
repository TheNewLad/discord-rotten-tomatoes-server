import express from "express";
import fetch from "node-fetch";
import { env } from "../config.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/authorize", async (req, res) => {
  const { supabaseUserId } = req.body;

  const user = await User.findOne({ supabaseUserId }).exec();

  if (user) {
    return res.status(200).json({ authorized: true });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
        method: "GET",
      },
    );

    const data = await response.json();

    if (response.status === 200) {
      const newUser = new User({
        supabaseUserId,
        discordUserId: data.user.id,
      });

      await newUser.save();

      return res.status(201).json({ authorized: true });
    }

    if (response.status === 401) {
      return res.status(401).json({ authorized: false });
    }

    if (response.status === 403) {
      return res.status(403).json({ authorized: false });
    }
  } catch (error) {
    console.error(error);
  }
});

export { router as authorizeUserRoute };
