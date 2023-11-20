const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./users");
// const ERRORS = require("../utils/errors");
const { NotFoundError } = require("../errors/not-found-err")

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res, next) => {
 next(new NotFoundError("Request is NOWHERE TO BE FOUND"))
});

module.exports = router;
