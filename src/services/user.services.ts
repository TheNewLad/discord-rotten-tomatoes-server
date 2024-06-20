import { User } from "@models/user.model";
import {
  getDiscordAccessToken,
  revokeClerkUserSession,
  updateClerkUserMetadata,
} from "@services/clerk.services";
import { findUserInDiscordServer } from "@services/discord.services";
import { findOrCreateSupabaseUserByDiscordUserId } from "@services/supabase.services";

interface ClerkIdentity {
  clerkSessionId: string;
  clerkUserId: string;
}

export type UserValidationResult =
  | { success: true; user: User }
  | { success: false };

export const validateUser = async ({
  clerkSessionId,
  clerkUserId,
}: ClerkIdentity): Promise<UserValidationResult> => {
  try {
    const discordAccessToken = await getDiscordAccessToken(clerkUserId);

    const discordUserPresence =
      await findUserInDiscordServer(discordAccessToken);

    if (!discordUserPresence.found) {
      await revokeClerkUserSession(clerkSessionId);

      return {
        success: false,
      };
    }

    const user: User = await findOrCreateSupabaseUserByDiscordUserId({
      clerkSessionId: clerkSessionId,
      discordUserId: discordUserPresence.id,
    });

    await updateClerkUserMetadata({
      metadata: { publicMetadata: { app_user_id: user.id } },
      userId: clerkUserId,
    });

    return { success: true, user };
  } catch (error) {
    throw new Error(`Error validating user: ${error}`);
  }
};
