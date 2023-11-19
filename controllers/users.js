const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const Users = require("../models/user");
// const ERRORS = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    // return res
    //   .status(ERRORS.BAD_REQUEST.STATUS)
    //   .send({ message: "Email and password are required." });
    throw new BadRequestError("Email and Password are REQUIRED!");
  }

  // return Users.findOne({ email })
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("User already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => Users.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      }),
    )
    .catch(next);
};

const getCurrentUsers = (req, res, next) => {
  const userId = req.user._id;

  Users.findById(userId)
  .orFail(() => new NotFoundError("User NOT FOUND :( "))
  .then((user) => res.send({ data: user }))
  .catch(next)
  // Users.findById(userId)
  //   .orFail()
  //   .then((user) => {
  //     res.send({ data: user });
  //   })
  //   .catch((err) => {
  //     if (err.name === "ValidationError" || err.name === "CastError") {
  //       return res
  //         .status(ERRORS.BAD_REQUEST.STATUS)
  //         .send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
  //     }
  //     if (err.name === "DocumentNotFoundError") {
  //       return res
  //         .status(ERRORS.NOT_FOUND.STATUS)
  //         .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
  //     }
  //     return res
  //       .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
  //       .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  //   });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
  .then((user) => {
    if(!user) {
      throw new NotFoundError("User not found");
    }
    res.send({ data: user });
  })
  .catch(next);
  // return Users.findByIdAndUpdate(
  //   req.user._id,
  //   { name, avatar },
  //   { new: true, runValidators: true },
  // )
  //   .then((user) => {
  //     if (!user) {
  //       return res
  //         .status(ERRORS.NOT_FOUND.STATUS)
  //         .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
  //     }
  //     return res.send({ data: user });
  //   })
  //   .catch((err) => {
  //     if (err.name === "ValidationError") {
  //       return res
  //         .status(ERRORS.BAD_REQUEST.STATUS)
  //         .send({ message: err.message });
  //     }
  //     return res
  //       .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
  //       .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  //   });
};

const login = (req, res, next) => {
  const { email, password } = req.body;


  Users.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token })
  })
  .catch(() => next(new UnauthorizedError("Incorrect email or password")))
  // return Users.findUserByCredentials(email, password)
  //   .then((user) => {
  //     const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
  //       expiresIn: "7d",
  //     });
  //     res.send({ token });
  //   })
  //   .catch(() => {
  //       res
  //         .status(ERRORS.UNAUTHORIZED.STATUS)
  //         .send({ message: "Incorrect email or password" });
  //   //   return res
  //   //     .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
  //   //     .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  //    });
  };

module.exports = {
  createUser,
  login,
  getCurrentUsers,
  updateUser,
};
