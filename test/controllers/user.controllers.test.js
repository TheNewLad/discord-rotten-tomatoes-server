import { UserController } from "#controllers/user.controllers";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("UserController", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("authorizeUser", () => {
    describe("when no action query param is provided", () => {
      it("should return 204 no content", () => {
        const req = { query: {} };
        const res = {
          status: vi.fn().mockImplementation(() => ({ end: vi.fn() })),
          json: vi.fn(),
          end: vi.fn(),
        };
        UserController.authorizeUser(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
      });
    });

    describe("when action query param is 'authorize'", () => {
      describe("when Clerk session ID is provided", () => {
        vi.mock("#services/user.services", () => ({
          UserService: {
            authorizeUser: vi.fn().mockResolvedValue({ authorized: true }),
          },
        }));

        it("should authorize the user", async () => {
          const req = {
            query: { action: "authorize" },
            access_token: "session-id",
          };
          const res = { json: vi.fn(), status: vi.fn() };

          await UserController.authorizeUser(req, res);
          expect(res.json).toHaveBeenCalledWith({ authorized: true });
        });
      });
    });
  });
});
