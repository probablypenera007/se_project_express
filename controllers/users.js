require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const Users = require("../models/user");
// const ERRORS = require("../utils/errors");
const { NODE_ENV, JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and Password are REQUIRED!"));
  }

  return Users.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("User already exists"));
      }
      return bcrypt.hash(password, 10)
    })
    .then((hash) => Users.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      }),
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const getCurrentUsers = (req, res, next) => {
  const userId = req.user._id;

  Users.findById(userId)
    .orFail(() => new NotFoundError("User NOT FOUND :( "))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "dev-secret", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError("Incorrect email or password")));
};

module.exports = {
  createUser,
  login,
  getCurrentUsers,
  updateUser,
};
