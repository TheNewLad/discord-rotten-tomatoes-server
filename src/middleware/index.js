export const authenticateRequest = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("authorization", authorization);
  if (!authorization) {
    return res.status(400).json({ message: "No access token provided" });
  }
  next();
};
