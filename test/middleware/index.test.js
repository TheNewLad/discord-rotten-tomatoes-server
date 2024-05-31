import { authenticateRequest, getBearerToken } from "#middleware/index";
import { describe, expect, it, vi } from "vitest";

describe("middleware", () => {
  describe("authenticateRequest", () => {
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

  describe("getBearerToken", () => {
    it("returns bearer token from authorization header", () => {
      const req = { headers: { authorization: "Bearer token" } };
      const next = vi.fn();
      getBearerToken(req, {}, next);
      expect(req.access_token).toBe("token");
      expect(next).toHaveBeenCalled();
    });
  });
});
