require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { validateUserBody, validateLogIn } = require("./middlewares/validation")
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("DB is connected");
  },
  (e) => console.log("DB ERROR", e),
);

app.use(cors());
app.use(express.json());

app.post("/signin", validateLogIn,login);

app.post("/signup", validateUserBody,createUser);

const routes = require("./routes");

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
