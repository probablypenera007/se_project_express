const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateUserBody } = require("../middlewares/validation");
const { getCurrentUsers, updateUser } = require("../controllers/users");


// Read
router.get("/me", auth, getCurrentUsers);

// Update
router.patch("/me", auth, validateUserBody, updateUser);

module.exports = router;
