/* eslint-disable no-console */
const Users = require('../models/clothingItem');

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
        .status(500)
        .send({
          message: 'Error from controllers, clothingItem, createItem',
          e,
        });
    });
};

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(500).send({ message: 'GET USERS ERRRORRR!', e });
    });
};

const getMainUser = (req, res) => {
  const { userId } = req.params.userId;

  console.log(userId);
  // ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
   Users.findById(userId)
     .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      res.status(500).send({ message: 'GET DAT USER ERRRRROORRRR!', e });
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