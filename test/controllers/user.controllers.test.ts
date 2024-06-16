import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { UserController } from "@controllers/user.controllers";
import { ClerkService } from "@services/clerk.services";
import { SupabaseServiceFactory } from "@services/supabase.services";
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
      const EXPECTED_ERROR_CODE = 403;

      vi.spyOn(UserService.prototype, "validateUser").mockResolvedValue({
        status: EXPECTED_ERROR_CODE,
        body: { message: "User is not in Discord server." },
      });

      ClerkService.init = vi.fn();
      ClerkService.getInstance = vi.fn();

      SupabaseServiceFactory.createService = vi.fn().mockResolvedValue({});

      await UserController.validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(EXPECTED_ERROR_CODE);
      expect(res.status(EXPECTED_ERROR_CODE).json).toHaveBeenCalledWith({
        message: "User is not in Discord server.",
      });
    });

    it("should return 200 OK when Discord user is in Discord server", async () => {
      const EXPECTED_ERROR_CODE = 200;

      ClerkService.init = vi.fn();
      ClerkService.getInstance = vi.fn();

      SupabaseServiceFactory.createService = vi.fn().mockResolvedValue({});

      vi.spyOn(UserService.prototype, "validateUser").mockResolvedValue({
        status: EXPECTED_ERROR_CODE,
        body: {
          message: "User validated.",
          user: {
            clerk_user_id: "",
            created_at: "",
            discord_user_id: "",
            id: 0,
            review_weights: "",
          },
        },
      });

      await UserController.validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(EXPECTED_ERROR_CODE);
      expect(res.status(EXPECTED_ERROR_CODE).json).toHaveBeenCalledWith({
        message: "User validated.",
        user: {
          clerk_user_id: "",
          created_at: "",
          discord_user_id: "",
          id: 0,
          review_weights: "",
        },
      });
    });

    it("should return 500 internal server error when an error occurs", async () => {
      const EXPECTED_ERROR_CODE = 500;

      ClerkService.init = vi.fn();
      ClerkService.getInstance = vi.fn();

      SupabaseServiceFactory.createService = vi
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
