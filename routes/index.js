const router = require('express').Router();
const clothingItem = require('./clothingItem');
const user = require('./users');
const ERRORS = require('../utils/errors');

router.use('/items', clothingItem);
router.use('/users', user)



// router.use((req, res) => {
//   res.status(ERRORS.BAD_REQUEST.STATUS).send({message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE})
// })

router.use((req, res) => {
  res
    .status(ERRORS.NOT_FOUND.STATUS)
    .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
});

// router.use((req, res) => {
//   res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({
//     message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE,
//   });
// });
module.exports = router;
