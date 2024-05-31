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
        describe("when UserService authorizes user without error", () => {
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

        describe("when UserService authorizes user with error", () => {
          it("should return 500 error", async () => {
            const req = {
              query: { action: "authorize" },
            };
            const json = vi.fn();
            const res = {
              status: vi.fn().mockReturnValue({ json }),
            };

            await UserController.authorizeUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(json).toHaveBeenCalledWith({
              message: "Failed to authorize user",
            });
          });
        });
      });
    });
  });
});
