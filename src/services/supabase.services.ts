import { env } from "@config/environment";
import { Database } from "@models/database.model";
import { NewUser, User } from "@models/user.model";
import { ClerkService } from "@services/clerk.services";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(token: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  }

  private async findUserByDiscordUserId(discordUserId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("discord_user_id", discordUserId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  private async createUser(newUser: NewUser): Promise<User> {
    const { data, error } = await this.supabase
      .from("users")
      .insert([newUser])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  public async findOrCreateUserByDiscordUserId(
    discordUserId: string,
  ): Promise<User> {
    // Find user by Discord ID
    let user = await this.findUserByDiscordUserId(discordUserId);

    // If user doesn't exist, create a new user
    if (!user) {
      console.log("User not found, creating new user");
      user = await this.createUser({ discord_user_id: discordUserId });
    }

    return user;
  }
}

export class SupabaseServiceFactory {
  public static async createService(clerkSessionId: string) {
    const token =
      await ClerkService.getInstance().getSupabaseToken(clerkSessionId);

    return new SupabaseService(token);
  }
}
