import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { validateUser as validateUserInService } from "@services/user.services";
import { Request, Response } from "express";

export const validateUser = async (
  req: Request & StrictAuthProp,
  res: Response,
) => {
  const { userId: clerkUserId, sessionId: clerkSessionId } = req.auth;

  try {
    const result = await validateUserInService({
      clerkUserId,
      clerkSessionId,
    });

    if (!result.success) {
      return res.status(403).json({ message: "User is not authorized." });
    }

    return res
      .status(200)
      .json({ message: "User is authorized.", user: result.user });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({ message: "Internal server error." });
  }
};
