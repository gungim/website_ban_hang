const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provider');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decode = jwt.decode(token, process.env.JWT_SECRET);
    const { id, username } = decode;
    req.user = { id, username };
    next();
  } catch (e) {
    throw new Error(e);
  }
};

const adminMiddleware = (req, res, next) => {};

module.exports = {
  authMiddleware,
};
