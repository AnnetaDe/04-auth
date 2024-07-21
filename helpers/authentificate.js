const { User } = require('../db/models/User');
const HttpError = require('./HttpError');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const authentificate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  if (!authorization) {
    return next(HttpError(401, 'Authorization failed'));
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401, 'Bearer not found'));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);

    if (!user) {
      return next(HttpError);
    }
    if (!token) {
      return next(HttpError(401, 'User already signout'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(HttpError(401, err.message));
  }
};

module.exports = authentificate;
