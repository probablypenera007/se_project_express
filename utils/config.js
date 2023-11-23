// require("dotenv").config();

const {
  // JWT_SECRET: process.env.JWT_SECRET
  NODE_ENV,
  JWT_SECRET
} = process.env;


module.exports = { NODE_ENV, JWT_SECRET };

// const { PORT = 3001 } = process.env;