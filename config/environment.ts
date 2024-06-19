import "dotenv/config";

export const env = {
  CLIENT_URL: process.env.CLIENT_URL,
  DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
  PORT: process.env.PORT || 4000,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
};
