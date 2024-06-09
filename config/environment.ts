import "dotenv/config";

export const env = {
  CLIENT_URL: process.env.CLIENT_URL,
  DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
  PORT: process.env.PORT || 4000,
};
