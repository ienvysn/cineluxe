const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Token is not valid" });
  }
  req.user = decoded;
  next();
};

module.exports = authenticate;
