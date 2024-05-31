import { env } from "#config/environment";

const doesUserExistInServer = async (discordAccessToken) => {
  try {
    const response = await fetch(
      `https://discord.com/api/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${discordAccessToken}`,
        },
        method: "GET",
      },
    );

    return response.ok;
  } catch (error) {
    console.error(error);
  }
};

export const DiscordService = {
  doesUserExistInServer,
};
