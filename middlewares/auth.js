const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const ERRORS = require('../utils/errors');

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.PERMISSION.DEFAULT_MESSAGE });
    }

    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE });
    }
    req.user = payload;

  return next();
};

module.exports = { auth }