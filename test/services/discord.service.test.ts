import { env } from "#config/environment";
import { DiscordService } from "#services/discord.services";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("DiscordService", () => {
  const discordAccessToken = "discord-access-token";
  const discordUserId = "discord-user-id";
  const expectedFetchArgs = [
    `https://discord.com/api/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
    {
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  ];

  let mockedFetch;

  beforeEach(() => {
    mockedFetch = vi.fn();
    global.fetch = mockedFetch;
  });

  describe("findUserInServer", () => {
    it("should return found true and user ID when the user is found in the server", async () => {
      const mockedResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ user: { id: discordUserId } }),
      };

      mockedFetch.mockResolvedValue(mockedResponse);

      const result = await DiscordService.findUserInServer(discordAccessToken);

      expect(result).toEqual({ found: true, id: discordUserId });
      expect(mockedFetch).toHaveBeenCalledWith(...expectedFetchArgs);
      expect(mockedResponse.json).toHaveBeenCalled();
    });

    it("should return found false when the user is not found in the server", async () => {
      const mockedResponse = {
        ok: false,
      };

      mockedFetch.mockResolvedValue(mockedResponse);

      const result = await DiscordService.findUserInServer(discordAccessToken);

      expect(result).toEqual({ found: false });
      expect(mockedFetch).toHaveBeenCalledWith(...expectedFetchArgs);
    });
  });
});
