/* eslint-disable no-console */
const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item, 'THIS IS CLOTHING ITEM CONTROLLER');
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res
        .status(500)
        .send({
          message: 'Error from controllers, clothingItem, createItem',
          e,
        });

    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: 'GET ITEMS ERRRORRR!', e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } }, { new: true })
  // ClothingItem.findByIdAndUpdate(itemId, { $set: imageURL }, { new: true })
  //   .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: 'UPDATE ITEMS ERRRRROORRRR!', e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
};
