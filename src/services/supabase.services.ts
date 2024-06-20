import { env } from "@config/environment";
import { User } from "@models/user.model";
import { getSupabaseToken } from "@services/clerk.services";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

const createSupabaseClient = (clerkSessionId: string) => {
  const supabaseToken = getSupabaseToken(clerkSessionId);

  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
  });
};

interface FindOrCreateSupabaseUserByDiscordUserIdProps {
  discordUserId: string;
  clerkSessionId: string;
}

export const findOrCreateSupabaseUserByDiscordUserId = async ({
  discordUserId,
  clerkSessionId,
}: FindOrCreateSupabaseUserByDiscordUserIdProps): Promise<User> => {
  const supabase = createSupabaseClient(clerkSessionId);

  const { data, error } = await supabase
    .from("users")
    .upsert(
      { discord_user_id: discordUserId },
      { onConflict: "discord_user_id" },
    )
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to find or create user.`);
  }

  return data;
};
