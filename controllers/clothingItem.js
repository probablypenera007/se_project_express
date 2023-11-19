const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");


const createItem = (req, res, next) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id, likes })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Item Format. Check Image URL Provided"))
      } else {
        next(err)
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(next)
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
   // return res
    //  .status(ERRORS.BAD_REQUEST.STATUS)
    //  .send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
    throw new BadRequestError("Invalid Item ID")
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item Does Not Exist!");
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("You Do Not Have The Permission To Delete This Item! tsk. tsk.");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.send({ data: itemId });
    })
    .catch(next);
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
