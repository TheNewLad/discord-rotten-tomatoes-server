import { clerkClient } from "@clerk/clerk-sdk-node";

const getUserMetadata = async (userId) => {
  const user = await clerkClient.users.getUser(userId);

  return {
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
    unsafeMetadata: user.unsafeMetadata,
  };
};

const getUserIdFromSession = async (sessionId) => {
  const { userId } = await clerkClient.sessions.getSession(sessionId);

  const { id } = await clerkClient.users.getUser(userId);

  return id;
};

const getUserDiscordOauthToken = async (userId) =>
  await clerkClient.users.getUserOauthAccessToken(userId, "oauth_discord");

const updateUserMetadata = async (userId, metadata) =>
  await clerkClient.users.updateUserMetadata(userId, metadata);

export const ClerkService = {
  getUserIdFromSession,
  getUserDiscordOauthToken,
  getUserMetadata,
  updateUserMetadata,
};
