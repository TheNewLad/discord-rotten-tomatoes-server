import { clerkClient } from "@clerk/clerk-sdk-node";

export class ClerkService {
  private static instance: ClerkService;

  private constructor() {
    console.log("ClerkService initialized");
  }

  public static getInstance(): ClerkService {
    if (!ClerkService.instance) {
      ClerkService.instance = new ClerkService();
    }

    return ClerkService.instance;
  }

  public async getUserMetadata(userId: string) {
    const user = await clerkClient.users.getUser(userId);

    return {
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      unsafeMetadata: user.unsafeMetadata,
    };
  }

  public async getUserIdFromSession(sessionId: string) {
    const { userId } = await clerkClient.sessions.getSession(sessionId);

    const { id } = await clerkClient.users.getUser(userId);

    return id;
  }

  public async getUserDiscordAccessToken(userId: string) {
    const discordOauthProvider = "oauth_discord";

    const userOauthAccessTokens =
      await clerkClient.users.getUserOauthAccessToken(
        userId,
        discordOauthProvider,
      );

    return userOauthAccessTokens.data.find(
      (account) => account.provider === discordOauthProvider,
    )?.token;
  }

  public async revokeUserSession(sessionId: string) {
    return clerkClient.sessions.revokeSession(sessionId);
  }

  public async updateUserMetadata(
    userId: string,
    metadata: {
      publicMetadata?: UserPublicMetadata;
      privateMetadata?: UserPrivateMetadata;
      unsafeMetadata?: UserUnsafeMetadata;
    },
  ) {
    return clerkClient.users.updateUserMetadata(userId, metadata);
  }

  public async getSupabaseToken(sessionId: string): Promise<string> {
    const { jwt } = await clerkClient.sessions.getToken(sessionId, "supabase");

    return jwt;
  }
}
