import { ClerkService } from "#services/clerk.services";
import { DiscordService } from "#services/discord.services";
import { UserService } from "#services/user.services";

const validateUser = async (req, res) => {
  const { userId: clerkUserId, sessionId: clerkSessionId } = req.auth;

  try {
    const discordAccessToken =
      await ClerkService.getUserDiscordAccessToken(clerkUserId);
    const discordUserPresence =
      await DiscordService.findUserInServer(discordAccessToken);

    if (!discordUserPresence.found) {
      await ClerkService.revokeUserSession(clerkSessionId);
      return res
        .status(403)
        .json({ message: "User is not in Discord server." });
    }

    await UserService.findOrCreateUserByDiscordId(discordUserPresence.id);

    return res.status(200).json({ message: "User is in Discord server." });
  } catch (error) {
    console.error("Error validating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const UserController = {
  validateUser,
};
