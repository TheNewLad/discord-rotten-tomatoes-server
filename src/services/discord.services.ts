import { env } from "@config/environment";

const findUserInServer = async (discordAccessToken: string) => {
  const response = await fetch(
    `https://discord.com/api/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
    {
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  );

  if (!response.ok) {
    return { found: false };
  }

  const { user } = await response.json();

  return { found: true, id: user.id };
};

export const DiscordService = {
  findUserInServer,
};
