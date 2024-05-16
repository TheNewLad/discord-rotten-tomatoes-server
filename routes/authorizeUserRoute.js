import express from "express";
import fetch from "node-fetch";
import { env } from "../config.js";

const router = express.Router();

const extractToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res
      .status(403)
      .json({ message: "No token provided. Access is forbidden." });
  }

  next();
};

router.get("/authorize", extractToken, async (req, res) => {
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

    if (response.status === 200) {
      return res.status(200).json({ authorized: true });
    }

    if (response.status === 401) {
      return res.status(401).json({ authorized: false });
    }

    if (response.status === 403) {
      return res.status(403).json({ authorized: false });
    }
  } catch (error) {
    console.log(error);
  }
});

export { router as authorizeUserRoute };
