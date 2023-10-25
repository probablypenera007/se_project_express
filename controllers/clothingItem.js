/* eslint-disable no-console */
const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
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
  const { imageUrl } = req.body;

  // ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
   ClothingItem.findByIdAndUpdate(itemId, { $set: {imageUrl} })
     .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: 'UPDATE ITEMS ERRRRROORRRR!', e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail().then.((item) => res.status(204).send({}))
  .catch((e) => {
    res.status(500).send({ message: 'DELETEEE ITEMS ERRRRROORRRR!', e });
  });
}

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
