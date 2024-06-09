import { env } from "@config/environment";

interface FoundResponse {
  found: true;
  id: string;
}

interface NotFoundResponse {
  found: false;
}

export class DiscordService {
  public async findUserInServer(
    discordAccessToken: string,
  ): Promise<FoundResponse | NotFoundResponse> {
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
  }
}
