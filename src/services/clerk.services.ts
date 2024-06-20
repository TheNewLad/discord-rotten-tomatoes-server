import { clerkClient } from "@clerk/clerk-sdk-node";

interface ClerkUserMetadata {
  publicMetadata?: UserPublicMetadata;
  privateMetadata?: UserPrivateMetadata;
  unsafeMetadata?: UserUnsafeMetadata;
}

interface UpdateClerkUserMetadataProps {
  userId: string;
  metadata: ClerkUserMetadata;
}

export const updateClerkUserMetadata = ({
  userId,
  metadata,
}: UpdateClerkUserMetadataProps) => {
  return clerkClient.users.updateUserMetadata(userId, metadata);
};

export const getSupabaseToken = async (sessionId: string): Promise<string> => {
  const { jwt } = await clerkClient.sessions.getToken(sessionId, "supabase");

  return jwt;
};

export const revokeClerkUserSession = async (sessionId: string) => {
  return await clerkClient.sessions.revokeSession(sessionId);
};

export const getDiscordAccessToken = async (
  userId: string,
): Promise<string> => {
  const discordOauthProvider = "oauth_discord";

  const userOauthAccessTokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    discordOauthProvider,
  );

  return userOauthAccessTokens.data.find(
    (account) => account.provider === discordOauthProvider,
  )?.token;
};
