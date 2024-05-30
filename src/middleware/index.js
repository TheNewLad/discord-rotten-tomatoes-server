export const authenticateRequest = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).end();
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
