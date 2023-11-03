require("dotenv").config();

const DEFAULT_SECRET = "5d8b8592978f8bd833ca8133";

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_SECRET,
};
