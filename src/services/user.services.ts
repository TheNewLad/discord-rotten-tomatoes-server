import { User } from "@models/user.model";
import { DiscordService } from "@services/discord.services";
import { SupabaseService } from "@services/supabase.services";
import { ClerkService } from "./clerk.services.js";

interface UserValidationResponse {
  status: number;
  message: string;
}

export class UserService {
  private clerkService: ClerkService;
  private discordService: DiscordService;
  private supabaseService: SupabaseService;

  constructor(
    clerkService: ClerkService,
    discordService: DiscordService,
    supabaseService: SupabaseService,
  ) {
    this.clerkService = clerkService;
    this.discordService = discordService;
    this.supabaseService = supabaseService;
  }

  private async getDiscordOauthToken(clerkUserId: string): Promise<string> {
    const discordOauthToken =
      await this.clerkService.getUserDiscordAccessToken(clerkUserId);

    if (!discordOauthToken) {
      throw new Error("User does not have a Discord OAuth token");
    }

    return discordOauthToken;
  }

  public async findOrCreateUserByDiscordUserId(
    discordUserId: string,
  ): Promise<User> {
    return await this.supabaseService.findOrCreateUserByDiscordUserId(
      discordUserId,
    );
  }

  async validateUser(
    clerkUserId: string,
    clerkSessionId: string,
  ): Promise<UserValidationResponse> {
    try {
      const discordAccessToken = await this.getDiscordOauthToken(clerkUserId);
      const discordUserPresence =
        await this.discordService.findUserInServer(discordAccessToken);

      if (!discordUserPresence.found) {
        await this.clerkService.revokeUserSession(clerkSessionId);
        return { status: 403, message: "User is not in Discord server." };
      }

      const user = await this.findOrCreateUserByDiscordUserId(
        discordUserPresence.id,
        clerkSessionId,
      );

      await this.clerkService.updateUserMetadata(clerkUserId, {
        publicMetadata: { app_user_id: user.id },
      });

      return { status: 200, message: "User is in Discord server." };
    } catch (error) {
      console.error("Error validating user:", error);
      return { status: 500, message: "Internal server error." };
    }
  }
}
