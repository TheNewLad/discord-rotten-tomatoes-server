import { env } from "@config/environment";
import { Database } from "@models/database.model";
import { User } from "@models/user.model";
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

  public async findOrCreateUserByDiscordUserId(
    discordUserId: string,
  ): Promise<User> {
    const { data, error } = await this.supabase
      .from("users")
      .upsert(
        { discord_user_id: discordUserId },
        { onConflict: "discord_user_id" },
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to find or create user: ${error.message}`);
    }

    return data;
  }
}

export class SupabaseServiceFactory {
  public static async createService() {
    console.info("Creating Supabase service");
    const token = await ClerkService.getInstance().getSupabaseToken();

    console.info("Supabase service created");
    return new SupabaseService(token);
  }
}
