export const authenticateRequest = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "No access token provided" });
  }
  next();
};

export const getBearerToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    req.access_token = authorization.split(" ")[1];
  }
  next();
};
