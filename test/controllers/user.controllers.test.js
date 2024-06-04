import { UserController } from "#controllers/user.controllers";
import { UserService } from "#services/user.services";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("#services/user.services");

describe("UserController", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("authorizeUser", () => {
    it("should return 204 no content when no action query param is provided", () => {
      const req = { query: {} };
      const res = {
        status: vi.fn().mockReturnValue({ end: vi.fn() }),
      };
      UserController.authorizeUser(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.status().end).toHaveBeenCalled();
    });

    describe("when action query param is 'authorize'", () => {
      it("should authorize the user when Clerk session ID is provided", async () => {
        const req = {
          query: { action: "authorize" },
          auth: { sessionId: "session-id" },
        };
        const res = { json: vi.fn(), status: vi.fn() };
        UserService.authorizeUser.mockResolvedValue({ authorized: true });

        await UserController.authorizeUser(req, res);

        expect(UserService.authorizeUser).toHaveBeenCalledWith("session-id");
        expect(res.json).toHaveBeenCalledWith({ authorized: true });
      });

      it("should return 500 error when UserService throws an error", async () => {
        const req = {
          query: { action: "authorize" },
          auth: { sessionId: "session-id" },
        };
        const res = {
          status: vi.fn().mockReturnValue({ json: vi.fn() }),
        };
        UserService.authorizeUser.mockRejectedValue(
          new Error("Authorization failed"),
        );

        await UserController.authorizeUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().json).toHaveBeenCalledWith({
          message: "Failed to authorize user",
        });
      });
    });
  });
});
