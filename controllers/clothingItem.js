/* eslint-disable consistent-return */

const mongoose = require('mongoose');
const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

const createItem = (req, res) => {

  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(req.user._id);
      console.log(item, "THIS IS CLOTHING ITEM CONTROLLER");
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(ERRORS.BAD_REQUEST.STATUS).send({
        message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE,
        e,
      });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res
        .status(ERRORS.NOT_FOUND.STATUS)
        .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE, e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);
  // ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res
        .status(ERRORS.NOT_FOUND.STATUS)
        .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE, e });
    });
};

// reminder: non-existent Id should be for 404 NOT FOUND, incorret ID is 400 BAD REQUEST based on POSTMAN
// .orFail(() => {       --- error handling reference, chapter 8 handling errors in JS
//   const error = new Error("No card found with that id");
//   error.statusCode = 404;
//   throw error; // Remember to throw an error so .catch handles it instead of .then
// })

const deleteItem = (req, res) => {
  const { itemId } = req.params;
console.log("I want to delete this ID:" , itemId);

if (!mongoose.Types.ObjectId.isValid(itemId)) {
  return res.status(ERRORS.NOT_FOUND.STATUS).send({message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE});
}
  ClothingItem.findByIdAndDelete(itemId, {new: false})
    .orFail(() => {
      const error = new Error(ERRORS.BAD_REQUEST.DEFAULT_MESSAGE);
      error.statusCode = ERRORS.BAD_REQUEST.STATUS;
      throw error;
    })
    .then(() => res.status(200).send({}))
    .catch((e) => {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE});
  }

  ClothingItem.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, {new: true})
    .then((item) => res.status(200 || 201).send({ data: item }))
    .orFail(() => {
      const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
      error.statusCode = ERRORS.NOT_FOUND.STATUS;
      throw error;
    })
    .catch((e) => {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
   const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE});
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((item) => res.status(200).send({ data: item }))

    .orFail(() => {
      const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
      error.statusCode = ERRORS.NOT_FOUND.STATUS;
      throw error;
    })
    .catch((e) => {
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
