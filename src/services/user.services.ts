import { SupabaseServiceFactory } from "@services/supabase.services";
import { ClerkService } from "./clerk.services.js";

const getClerkUserId = async (clerkSessionId: string) => {
  if (!clerkSessionId) {
    throw new Error("Clerk session ID is required");
  }

  return await ClerkService.getUserIdFromSession(clerkSessionId);
};

const checkIfUserIsAlreadyAuthorized = async (clerkUserId: string) => {
  const { publicMetadata } = await ClerkService.getUserMetadata(clerkUserId);

  return !!publicMetadata.authorized;
};

const getDiscordOauthToken = async (clerkUserId: string) => {
  const discordOauthToken =
    await ClerkService.getUserDiscordAccessToken(clerkUserId);

  if (!discordOauthToken) {
    throw new Error("User does not have a Discord OAuth token");
  }

  return discordOauthToken;
};

const findOrCreateUserByDiscordUserId = async (
  discordUserId: string,
  clerkSessionId: string,
) => {
  const supabaseService = await SupabaseServiceFactory(clerkSessionId);

  return await supabaseService.findOrCreateUserByDiscordUserId(discordUserId);
};

export const UserService = {
  findOrCreateUserByDiscordUserId,
};
