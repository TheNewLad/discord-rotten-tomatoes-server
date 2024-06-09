import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { ClerkService } from "@services/clerk.services";
import { DiscordService } from "@services/discord.services";
import { SupabaseServiceFactory } from "@services/supabase.services";
import { UserService } from "@services/user.services";
import { Request, Response } from "express";

const validateUser = async (req: Request & StrictAuthProp, res: Response) => {
  const { userId: clerkUserId, sessionId: clerkSessionId } = req.auth;

  ClerkService.init({ userId: clerkUserId, sessionId: clerkSessionId });

  const clerkService = ClerkService.getInstance();
  const discordService = new DiscordService();
  const supabaseService = await SupabaseServiceFactory.createService();

  const userService = new UserService(
    clerkService,
    discordService,
    supabaseService,
  );

  try {
    const { status, message } = await userService.validateUser();

    return res.status(status).json({ message });
  } catch (error) {
    console.error("Error validating user:", error);

    return res.status(500).json({ message: "Internal server error." });
  }
};

export const UserController = {
  validateUser,
};
