/* eslint-disable consistent-return */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const Users = require('../models/user');
const ERRORS = require('../utils/errors');

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  Users.create({ name, avatar })
    .then((user) => {
      console.log(user, 'THIS IS USER CONTROLLER');
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      res
        .status(ERRORS.BAD_REQUEST.STATUS)
        .send({
          message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE, e
        });
    });
};
// [-] [GET] Get a user with an _id that does not exist in the database
const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message:ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
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

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;

//   console.log(itemId);
//   ClothingItem.findByIdAndDelete(itemId).orFail().then(() => res.status(200).send({}))
//   .catch((e) => {
//     res.status(500).send({ message: 'DELETEEE ITEMS ERRRRROORRRR!', e });
//   });
// }




module.exports = {
  createUser,
  getUsers,
  getMainUser,
};