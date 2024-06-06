import { clerkClient } from "@clerk/clerk-sdk-node";

const getUserMetadata = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  return {
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
    unsafeMetadata: user.unsafeMetadata,
  };
};

const getUserIdFromSession = async (sessionId: string) => {
  const { userId } = await clerkClient.sessions.getSession(sessionId);

  const { id } = await clerkClient.users.getUser(userId);

  return id;
};

const getUserDiscordAccessToken = async (userId: string) => {
  const discordOauthProvider = "oauth_discord";

  const userOauthAccessTokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    discordOauthProvider,
  );

  return userOauthAccessTokens.data.find(
    (account) => account.provider === discordOauthProvider,
  )?.token;
};

const revokeUserSession = async (sessionId: string) =>
  clerkClient.sessions.revokeSession(sessionId);

const updateUserMetadata = async (
  userId: string,
  metadata: {
    publicMetadata?: UserPublicMetadata;
    privateMetadata?: UserPrivateMetadata;
    unsafeMetadata?: UserUnsafeMetadata;
  },
) => await clerkClient.users.updateUserMetadata(userId, metadata);

export const ClerkService = {
  getUserIdFromSession,
  getUserDiscordAccessToken,
  getUserMetadata,
  revokeUserSession,
  updateUserMetadata,
};
