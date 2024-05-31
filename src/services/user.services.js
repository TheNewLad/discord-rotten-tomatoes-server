import { ClerkService } from "./clerk.services.js";
import { DiscordService } from "./discord.services.js";

const getClerkUserId = async (clerkSessionId) => {
  if (!clerkSessionId) {
    throw new Error("Clerk session ID is required");
  }

  return await ClerkService.getUserIdFromSession(clerkSessionId);
};

const checkIfUserIsAlreadyAuthorized = async (clerkUserId) => {
  const { publicMetadata } = await ClerkService.getUserMetadata(clerkUserId);

  return !!publicMetadata.authorized;
};

const getDiscordOauthToken = async (clerkUserId) => {
  const discordOauthToken =
    await ClerkService.getUserDiscordOauthToken(clerkUserId);

  if (!discordOauthToken) {
    throw new Error("User does not have a Discord OAuth token");
  }

  return discordOauthToken;
};

const authorizeUser = async (clerkSessionId) => {
  try {
    const clerkUserId = await getClerkUserId(clerkSessionId);

    const isUserAlreadyAuthorized =
      await checkIfUserIsAlreadyAuthorized(clerkUserId);
    if (isUserAlreadyAuthorized) {
      return { authorized: true };
    }

    const discordOauthToken = await getDiscordOauthToken(clerkUserId);

    const isUserInServer =
      !!(await DiscordService.doesUserExistInServer(discordOauthToken));

    await ClerkService.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        authorized: isUserInServer,
      },
    });

    return { authorized: isUserInServer };
  } catch (error) {
    throw new Error(`Failed to authorize user: ${error}`);
  }
};

export const UserService = {
  authorizeUser,
};
