import { User } from "@models/user.model";
import { DiscordService } from "@services/discord.services";
import { SupabaseService } from "@services/supabase.services";
import { ClerkService } from "./clerk.services.js";

interface UserValidationResponse {
  status: number;
  body: { message: string; user?: User };
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

  private async getDiscordOauthToken(): Promise<string> {
    const discordOauthToken =
      await this.clerkService.getUserDiscordAccessToken();

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

  async validateUser(): Promise<UserValidationResponse> {
    try {
      const discordAccessToken = await this.getDiscordOauthToken();

      const discordUserPresence =
        await this.discordService.findUserInServer(discordAccessToken);

      if (!discordUserPresence.found) {
        await this.clerkService.revokeUserSession();
        return {
          status: 403,
          body: { message: "User is not in Discord server." },
        };
      }

      const user = await this.findOrCreateUserByDiscordUserId(
        discordUserPresence.id,
      );

      await this.clerkService.updateUserMetadata({
        publicMetadata: { app_user_id: user.id },
      });

      return { status: 200, body: { message: "User validated", user } };
    } catch (error) {
      console.error("Error validating user:", error);
      return { status: 500, body: { message: "Internal server error." } };
    }
  }
}
