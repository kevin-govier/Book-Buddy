const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1]; // gets the second part from 'Bearer [token]' from after the space
  try {
    const decodedToken = jwt.verify(token, 'secretfortoken');
    if (!decodedToken) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      return next(error);
    }

    req.isLoggedIn = true;
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
};