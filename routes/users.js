const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUsers, updateUser } = require("../controllers/users");

// Read
router.get("/me", auth, getCurrentUsers);

// Update
router.patch("/me", auth, updateUser);

module.exports = router;
