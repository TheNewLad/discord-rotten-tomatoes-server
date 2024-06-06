import { UserModel } from "@models/user.model";
import { ClerkService } from "./clerk.services.js";
import { DiscordService } from "./discord.services.js";

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

const authorizeUser = async (clerkSessionId: string) => {
  try {
    const clerkUserId = await getClerkUserId(clerkSessionId);

    const isUserAlreadyAuthorized =
      await checkIfUserIsAlreadyAuthorized(clerkUserId);
    if (isUserAlreadyAuthorized) {
      return { authorized: true };
    }

    const discordOauthToken = await getDiscordOauthToken(clerkUserId);

    const isUserInServer =
      !!(await DiscordService.findUserInServer(discordOauthToken));

    return { authorized: isUserInServer };
  } catch (error) {
    throw new Error(`Failed to authorize user: ${error}`);
  }
};

const findOrCreateUserByDiscordId = async (discordId: string) => {
  // Find user by Discord ID
  const user = await UserModel.findOne({ discordId });

  // If user doesn't exist, create a new user

  if (!user) {
    return await UserModel.create({ discordId });
  }

  return user;
};

export const UserService = {
  authorizeUser,
  findOrCreateUserByDiscordId,
};
