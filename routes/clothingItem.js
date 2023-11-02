
const router = require('express').Router();
const { auth } = require('../middlewares/auth');


const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CRUD

// Create
router.post('/', auth, createItem);

// Read
router.get('/',  getItems);

// Update
router.put('/:itemId/likes', auth, likeItem);
// Delete
router.delete('/:itemId', auth,  deleteItem);
router.delete('/:itemId/likes', auth, dislikeItem);

module.exports = router;