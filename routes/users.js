const router = require('express').Router();

const {getUsers, getMainUser, createUser } = require('../controllers/users');

// CRUD

// Create
router.post('/', createUser);

// Read
router.get('/', getUsers);

// Read
router.get('/:userId', getMainUser);

module.exports = router;