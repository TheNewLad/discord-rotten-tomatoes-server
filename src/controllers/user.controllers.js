import { UserService } from "#services/user.services";

const authorizeUser = async (req, res) => {
  const { action } = req.query;
  if (action === "authorize") {
    const clerkSessionId = req.access_token;

    try {
      const { authorized } = await UserService.authorizeUser(clerkSessionId);

      res.json({ authorized });
    } catch (error) {
      console.error(`Failed to authorize user: ${error}`);

      res.status(500).json({ message: "Failed to authorize user" });
    }
  } else {
    res.status(204).end(); // No Content
  }
};

export const UserController = {
  authorizeUser,
};
