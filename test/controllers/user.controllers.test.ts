import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { UserController } from "@controllers/user.controllers";
import { ClerkService } from "@services/clerk.services";
import { DiscordService } from "@services/discord.services";
import { UserService } from "@services/user.services";
import { Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@services/user.services");
vi.mock("@services/discord.services");
vi.mock("@services/clerk.services");

describe("UserController", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("validateUser", () => {
    const clerkUserId = "clerk-user-id";
    const clerkSessionId = "clerk-session-id";

    const req = {
      auth: { userId: clerkUserId, sessionId: clerkSessionId },
    } as Request & StrictAuthProp;
    const res = {
      status: vi.fn().mockReturnValue({ json: vi.fn() }),
    } as unknown as Response;

    const discordUserId = "discord-user-id";
    const discordAccessToken = "discord-access-token";

    it("should return 403 unauthorized when Discord user is not in Discord server", async () => {
      const discordUserPresence = { found: false };

      ClerkService.getUserDiscordAccessToken = vi
        .fn()
        .mockResolvedValue(discordAccessToken);
      DiscordService.findUserInServer = vi
        .fn()
        .mockResolvedValue(discordUserPresence);

      await UserController.validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      // @ts-ignore
      expect(res.status().json).toHaveBeenCalledWith({
        message: "User is not in Discord server.",
      });
      expect(ClerkService.getUserDiscordAccessToken).toHaveBeenCalledWith(
        clerkUserId,
      );
      expect(DiscordService.findUserInServer).toHaveBeenCalledWith(
        discordAccessToken,
      );
      expect(ClerkService.revokeUserSession).toHaveBeenCalledWith(
        clerkSessionId,
      );
    });

    it("should return 200 OK when Discord user is in Discord server", async () => {
      const discordUserPresence = { found: true, id: discordUserId };

      ClerkService.getUserDiscordAccessToken = vi
        .fn()
        .mockResolvedValue(discordAccessToken);
      DiscordService.findUserInServer = vi
        .fn()
        .mockResolvedValue(discordUserPresence);

      await UserController.validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      // @ts-ignore
      expect(res.status().json).toHaveBeenCalledWith({
        message: "User is in Discord server.",
      });
      expect(ClerkService.getUserDiscordAccessToken).toHaveBeenCalledWith(
        clerkUserId,
      );
      expect(DiscordService.findUserInServer).toHaveBeenCalledWith(
        discordAccessToken,
      );
      expect(ClerkService.revokeUserSession).not.toHaveBeenCalledWith(
        clerkSessionId,
      );
      expect(UserService.findOrCreateUserByDiscordUserId).toHaveBeenCalledWith(
        discordUserId,
      );
    });

    it("should return 500 internal server error when an error occurs", async () => {
      ClerkService.getUserDiscordAccessToken = vi
        .fn()
        .mockRejectedValue(new Error());

      await UserController.validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      // @ts-ignore
      expect(res.status().json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
