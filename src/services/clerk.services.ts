import { clerkClient } from "@clerk/clerk-sdk-node";

export class ClerkService {
  private readonly userId: string;
  private readonly sessionId: string;
  private static clerkService: ClerkService;

  private constructor({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  public static init({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    console.info("Initializing ClerkService");

    this.clerkService = new ClerkService({ userId, sessionId });
  }

  public static getInstance() {
    if (!this.clerkService) {
      throw new Error("ClerkService not initialized");
    }

    return this.clerkService;
  }

  public async getUserMetadata() {
    const user = await clerkClient.users.getUser(this.userId);

    return {
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      unsafeMetadata: user.unsafeMetadata,
    };
  }

  public async getUserDiscordAccessToken() {
    const discordOauthProvider = "oauth_discord";

    const userOauthAccessTokens =
      await clerkClient.users.getUserOauthAccessToken(
        this.userId,
        discordOauthProvider,
      );

    return userOauthAccessTokens.data.find(
      (account) => account.provider === discordOauthProvider,
    )?.token;
  }

  public async revokeUserSession() {
    return clerkClient.sessions.revokeSession(this.sessionId);
  }

  public async updateUserMetadata(metadata: {
    publicMetadata?: UserPublicMetadata;
    privateMetadata?: UserPrivateMetadata;
    unsafeMetadata?: UserUnsafeMetadata;
  }) {
    return clerkClient.users.updateUserMetadata(this.userId, metadata);
  }

  public async getSupabaseToken(): Promise<string> {
    const { jwt } = await clerkClient.sessions.getToken(
      this.sessionId,
      "supabase",
    );

    return jwt;
  }
}
