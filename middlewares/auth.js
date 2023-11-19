const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

// const ERRORS = require('../utils/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.PERMISSION.DEFAULT_MESSAGE });
    throw new UnauthorizedError("Authorization required auth.js");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    // return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE });
    const err = new Error("Unauthorized Token");
    err.statusCode = 401;
  }
  req.user = payload;

  return next();
};

module.exports = { auth };
