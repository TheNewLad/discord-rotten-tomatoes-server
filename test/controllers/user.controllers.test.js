import { UserController } from "#controllers/user.controllers";
import { describe, expect, it, vi } from "vitest";

describe("UserController", () => {
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
      it("should return 'Authorize user'", () => {
        const req = { query: { action: "authorize" } };
        const res = { status: vi.fn(), json: vi.fn() };
        UserController.authorizeUser(req, res);
        expect(res.json).toHaveBeenCalledWith("Authorize user");
      });
    });
  });
});
