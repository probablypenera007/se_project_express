const router = require("express").Router();
// const { auth } = require("../middlewares/auth");
const {  validateId } = require("../middlewares/validation");
const { getCurrentUsers, updateUser } = require("../controllers/users");


// Read
router.get("/me",
// auth,
 validateId, getCurrentUsers);

// Update
router.patch("/me",
// auth,
validateId, updateUser);

module.exports = router;
