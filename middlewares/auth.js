// require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;



  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.PERMISSION.DEFAULT_MESSAGE });
    throw new UnauthorizedError("Authorization required auth.js");
  }

  const token = authorization.replace("Bearer ", "");

  console.log('Authorization header:', req.headers.authorization);


  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    // const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('Token is valid. Decoded payload:', decoded)
  }
  catch (e) {
    // catch (error) {
    //   console.error('Token is invalid:', error.message);
    // return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE });
    // const err = new Error("Unauthorized Token");
    // err.statusCode = 401;
    return next(new UnauthorizedError("Unauthorized Token in auth.js"));
  }
  req.user = payload;

  return next();
};


module.exports = { auth };
