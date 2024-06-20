import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { validateUser } from "@controllers/user.controllers";
import * as userService from "@services/user.services";
import { Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validateUser", () => {
    const clerkUserId = "clerk-user-id";
    const clerkSessionId = "clerk-session-id";
    let req: Request & StrictAuthProp, res: Response;

    beforeEach(() => {
      req = {
        auth: { userId: clerkUserId, sessionId: clerkSessionId },
      } as Request & StrictAuthProp;
      res = {
        status: vi.fn().mockReturnValue({ json: vi.fn() }),
      } as unknown as Response;
    });

    it("should return 403 unauthorized when Discord user is not in Discord server", async () => {
      vi.spyOn(userService, "validateUser").mockResolvedValue({
        success: false,
      });

      const EXPECTED_ERROR_CODE = 403;

      await validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(EXPECTED_ERROR_CODE);
      expect(res.status(EXPECTED_ERROR_CODE).json).toHaveBeenCalledWith({
        message: "User is not authorized.",
      });
    });

    it("should return 200 OK when Discord user is in Discord server", async () => {
      vi.spyOn(userService, "validateUser").mockResolvedValue({
        success: true,
        user: {
          clerk_user_id: "",
          created_at: "",
          discord_user_id: "",
          id: 0,
          review_weights: "",
        },
      });

      const EXPECTED_ERROR_CODE = 200;

      await validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(EXPECTED_ERROR_CODE);
      expect(res.status(EXPECTED_ERROR_CODE).json).toHaveBeenCalledWith({
        message: "User is authorized.",
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
      vi.spyOn(userService, "validateUser").mockRejectedValue(new Error());

      const EXPECTED_ERROR_CODE = 500;

      await validateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(EXPECTED_ERROR_CODE);
      // @ts-ignore
      expect(res.status().json).toHaveBeenCalledWith({
        message: "Internal server error.",
      });
    });
  });
});
