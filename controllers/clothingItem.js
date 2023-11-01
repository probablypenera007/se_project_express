/* eslint-disable no-console */

/* eslint-disable consistent-return */

const mongoose = require('mongoose');
const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.body);
const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id, likes })
    .then((item) => {
      console.log(req.user._id);
      console.log(item, "THIS IS CLOTHING ITEM CONTROLLER");
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.BAD_REQUEST.STATUS).send({
          message: err.message
        });
      }
        res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE})
    });
};


const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({data: items}))
    .catch(() => {
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE});
    });
  };



const deleteItem = (req, res) => {
  const { itemId } = req.params;
console.log("I want to delete this ID:" , itemId);

if (!mongoose.Types.ObjectId.isValid(itemId)) {
  return res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE});
}

ClothingItem.findById(itemId)
.then((item) => {
  if (!item) {
    throw new Error(ERRORS.NOT_FOUND.STATUS.DEFAULT_MESSAGE);
    // error.statusCode = ERRORS.NOT_FOUND.STATUS;
    // throw error;
  }
  // if (item.owner.toString() !== req.user._id.toString()) {
  //   return res.status(ERRORS.PERMISSION.STATUS).send({ message: ERRORS.PERMISSION.DEFAULT_MESSAGE });
  if(item.owner.toString() !== req.user._id.toString()){
    throw new Error(ERRORS.PERMISSION.STATUS.DEFAULT_MESSAGE)
}
 // return item.delete();
 return ClothingItem.findByIdAndDelete(itemId);
})

  // ClothingItem.findByIdAndDelete(itemId, {new: false})
  //   .orFail(() => {
  //     const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
  //     error.statusCode = ERRORS.NOT_FOUND.STATUS;
  //     throw error;
  //   })
  //   .then(() => res.send({data: itemId}))
  //   .catch((err) => {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).send({ message: err.message });
  //     }
  //     res
  //       .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
  //       .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE});
  //   });
  .then(() => {
    res.send({ data: itemId });
  })
  .catch(err => {
    if (err.message === ERRORS.NOT_FOUND.DEFAULT_MESSAGE) {
      return res.status(ERRORS.NOT_FOUND.STATUS).send({ message: err.message });
    }
    if (err.message === ERRORS.PERMISSION.DEFAULT_MESSAGE) {
      return res.status(ERRORS.PERMISSION.STATUS).send({ message: err.message });
    }
    if (err.statusCode) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`[likeItem] Received itemId: ${itemId}`)

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE});
  }

  console.log(`[likeItem] Attempting to like item with itemId: ${itemId} for user: ${req.user._id}`);

  ClothingItem.findByIdAndUpdate(itemId, { $addToSet: { likes: req.user._id } }, {new: true})
.orFail(() => {
  console.log('[likeItem] Item not found for itemId:', itemId);
  const error = new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
  error.statusCode = ERRORS.NOT_FOUND.STATUS;
  throw error;
})
  .then((item) => res.send({data: item}))
   .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      res
        .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
        .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE});
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE});
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes:  mongoose.Types.ObjectId(req.user._id) } },
    { new: true },
  )
    .orFail(new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE))
    .then((item) => res.send({ data: item}))
    .catch((e) => {
      if (e.message === ERRORS.NOT_FOUND.DEFAULT_MESSAGE) {
        return res.status(ERRORS.NOT_FOUND.STATUS).send({ message: e.message });
      }
      if (e.statusCode) {
        return res.status(e.statusCode).send({ message: e.message });
      }
      res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE, e });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
