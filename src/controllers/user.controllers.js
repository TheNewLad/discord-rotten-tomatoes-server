import { ClerkService } from "#services/clerk.services";
import { DiscordService } from "#services/discord.services";
import { UserService } from "#services/user.services";

const validateUser = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const clerkSessionId = req.auth.sessionId;

  const discordAccessToken =
    await ClerkService.getUserDiscordAccessToken(clerkUserId);
  const discordUserPresence =
    await DiscordService.findUserInServer(discordAccessToken);

  if (!discordUserPresence.found) {
    await ClerkService.revokeUserSession(clerkSessionId);
    return res.status(403).json({ message: "User is not in Discord server." });
  }

  await UserService.findOrCreateUserByDiscordId(discordUserPresence.id);

  return res.status(200).json({ message: "User is in Discord server." });
};

export const UserController = {
  validateUser,
};
