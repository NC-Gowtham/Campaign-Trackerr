const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key-change-me'; // Must be the same as in server.js

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // No auth header
  }
};