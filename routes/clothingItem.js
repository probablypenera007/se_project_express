const router = require('express').Router();
const { createItem, getItems, updateItem } = require('../controllers/clothingItem');

// CRUD

// Create
router.post('/', createItem);

// Read
router.get('/', getItems);

// Update
router.put('/:itemId', updateItem);

// Delete


module.exports = router;

