/* eslint-disable no-console */
const ClothingItem = require('../models/clothingItem');
const ERRORS = require('../utils/errors');

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item, 'THIS IS CLOTHING ITEM CONTROLLER');
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res
        .status(ERRORS.BAD_REQUEST.STATUS)
        .send({
          message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE, e
        });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(ERRORS.NOT_FOUND.STATUS).send({ message:ERRORS.NOT_FOUND.DEFAULT_MESSAGE, e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);
  // ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
   ClothingItem.findByIdAndUpdate(itemId, { $set: {imageUrl} })
     .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(ERRORS.NOT_FOUND.STATUS).send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE, e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail().then(() => res.status(200).send({}))
  .catch((e) => {
    res.status(ERRORS.NOT_FOUND.STATUS).send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE, e });
  });
}

const likeItem = (req, res) => {
  const { itemId } = req.params;

ClothingItem.findByIdAndUpdate(itemId, { $set: { likes: req.user._id } })
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE, e });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

ClothingItem.findByIdAndUpdate(itemId, { $set: { likes: req.user._id } })
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE, e });
    });
};



module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem
};
