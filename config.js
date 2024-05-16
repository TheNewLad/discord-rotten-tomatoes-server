import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

export const env = {
  CLIENT_URL: process.env.CLIENT_URL,
  DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 4000,
};
