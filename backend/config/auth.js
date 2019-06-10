const jwt = require('jsonwebtoken');
const keys = require('./config');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    res.status(401).json({ error: 'No token authorization denied' });
  } else {
    // verifty token
    try {
      const decoded = jwt.verify(token, keys.secretOrKey);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  }
};
