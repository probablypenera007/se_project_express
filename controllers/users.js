/* eslint-disable consistent-return */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ERRORS = require('../utils/errors');


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
  .then(hash =>  Users.create({ name, avatar, email, password: hash }))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: err.message });
    }
    res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  });
};




// [-] [GET] Get a user with an _id that does not exist in the database
const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data : users }))
    .catch(() => {
      res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message:ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE});
    });
};

const getMainUser = (req, res) => {
  const {userId} = req.params;

  console.log(userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
  }
  // ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
   Users.findById(userId)
     .orFail(() => {
      const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
      error.statusCode = ERRORS.NOT_FOUND.STATUS;
      throw error;
     })
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message:ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

module.exports = {
  createUser,
  getUsers,
  getMainUser,
};