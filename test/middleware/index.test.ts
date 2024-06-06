import { authenticateRequest } from "@middleware/index";
import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

describe("middleware", () => {
  describe("authenticateRequest", () => {
    it("calls next if authorization header is provided", () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      } as Request;
      const next = vi.fn();

      authenticateRequest(req, {} as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 Unauthorized if authorization header is not provided", () => {
      const req = { headers: {} } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      authenticateRequest(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No access token provided",
      });
    });
  });
});
