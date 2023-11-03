const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id, likes })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERRORS.BAD_REQUEST.STATUS).send({
          message: err.message,
        });
      }
      return res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERRORS.BAD_REQUEST.STATUS)
      .send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new Error(ERRORS.PERMISSION.DEFAULT_MESSAGE);
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.send({ data: itemId });
    })
    .catch((err) => {
      if (err.message === ERRORS.NOT_FOUND.DEFAULT_MESSAGE) {
        return res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: err.message });
      }
      if (err.message === ERRORS.PERMISSION.DEFAULT_MESSAGE) {
        return res
          .status(ERRORS.PERMISSION.STATUS)
          .send({ message: err.message });
      }
      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERRORS.BAD_REQUEST.STATUS)
      .send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
      error.statusCode = ERRORS.NOT_FOUND.STATUS;
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERRORS.BAD_REQUEST.STATUS)
      .send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: mongoose.Types.ObjectId(req.user._id) } },
    { new: true },
  )
    .orFail(new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE))
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.message === ERRORS.NOT_FOUND.DEFAULT_MESSAGE) {
        return res.status(ERRORS.NOT_FOUND.STATUS).send({ message: e.message });
      }
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      return res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
