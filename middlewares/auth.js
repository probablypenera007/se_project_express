
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

console.log("Loaded JWT_SECRET:", JWT_SECRET);
const ERRORS = require('../utils/errors');



const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE });
    }

    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message: ERRORS.UNAUTHORIZED.DEFAULT_MESSAGE });
    }

    req.user = payload;

    console.log("Decoded JWT Payload:", req.user);

    return next();
};

module.exports = { auth }


// // middleware/auth.js  -- Dealing With Tokens

// const jwt = require('jsonwebtoken');

// module.exports = (req,res,next) => {
//   const { authorization }= req.headers;

//   if(!authorization || !authorization.startsWith('Bearer')) {
//   return res.status(401).send({ message:'Authorization Required' });
//   }

// const token = authorization.repalce('Bearer', '');
// let payload;

// try {
//   payload = jwt.verify(token, 'some-secret-key');
// } catch (err) {
//   return res.status(401).send({ message: 'Authorization Requred' });
// }

// req.user = payload; // assigning the payload to the request object

// next();  // sending the request to the next middleware

// };