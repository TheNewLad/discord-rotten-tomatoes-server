import { authenticateRequest, getBearerToken } from "#middleware/index";
import { describe, expect, it, vi } from "vitest";

describe("middleware", () => {
  describe("authenticateRequest", () => {
    it("calls next if authorization header is provided", () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };
      const next = vi.fn();

      authenticateRequest(req, {}, next);
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 Unauthorized if authorization header is not provided", () => {
      const req = { headers: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      authenticateRequest(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "No access token provided",
      });
    });
  });
});
