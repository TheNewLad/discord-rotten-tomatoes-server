import { env } from "@config/environment";
import { Database } from "@models/database.model";
import { NewUser, User } from "@models/user.model";
import { ClerkService } from "@services/clerk.services";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

let supabase: SupabaseClient<Database> | null = null;

const initClient = async (clerkSessionId: string) => {
  if (!clerkSessionId) {
    throw new Error("Clerk session ID is required");
  }

  if (!supabase) {
    console.log("Initializing Supabase client");

    const token = await ClerkService.getSupabaseToken(clerkSessionId);

    supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    console.log("Supabase client initialized");
  }
};

const findUserByDiscordUserId = async (
  discordUserId: string,
): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }

  return data;
};

const createUser = async (newUser: NewUser): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
};

const findOrCreateUserByDiscordUserId = async (
  discordUserId: string,
): Promise<User> => {
  // Find user by Discord ID
  let user = await findUserByDiscordUserId(discordUserId);

  // If user doesn't exist, create a new user
  if (!user) {
    console.log("User not found, creating new user");
    user = await createUser({ discord_user_id: discordUserId });
  }

  return user;
};

export const SupabaseServiceFactory = async (clerkSessionId: string) => {
  await initClient(clerkSessionId);

  return {
    findOrCreateUserByDiscordUserId,
    createUser,
  };
};
