const authorizeUser = (req, res) => {
  const { action } = req.query;
  if (action === "authorize") {
    res.json("Authorize user");
  } else {
    res.status(204).end(); // No Content
  }
};

export const UserController = {
  authorizeUser,
};
