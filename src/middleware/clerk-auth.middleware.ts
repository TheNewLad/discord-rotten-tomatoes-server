const handleClerkAuthError = (error, req, res, next) => {
  if (!error) {
    return next();
  }
  console.error(`Clerk Auth Error: ${error.message}`);
  res.status(401).json({ error: "unauthenticated" });
};

export const ClerkAuthMiddleware = {
  handleClerkAuthError,
};
