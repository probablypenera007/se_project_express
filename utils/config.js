// const crypto = require('crypto');
require('dotenv').config();


module.exports = {
  JWT_SECRET: process.env.JWT_SECRET
}

// const randomString = crypto.randomBytes(16).toString('hex');
// console.log(randomString);


