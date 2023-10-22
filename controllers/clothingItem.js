/* eslint-disable no-console */
const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl }).then((item) => {
    console.log(item, 'THIS IS CLOTHING ITEM CONTROLLER');
    res.send({ data: item });
  }).catch((e) => {
    res.status(500).send({ message: 'Error from controllers, clothingItem', e });
  });
};
module.exports = {
  createItem
};