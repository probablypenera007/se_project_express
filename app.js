require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db",
() => {
  console.log("DB is connected");
},
(e) => console.log("DB ERROR", e),
);

app.use(cors());
app.use(express.json());

app.post("/signin", login);

app.post("/signup", createUser);

const routes = require("./routes");

app.use(routes);

app.listen(PORT);
