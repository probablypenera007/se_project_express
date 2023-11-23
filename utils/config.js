require("dotenv").config();

const {
  // JWT_SECRET: process.env.JWT_SECRET
  JWT_SECRET
} = process.env;


export default JWT_SECRET;

// const { PORT = 3001 } = process.env;