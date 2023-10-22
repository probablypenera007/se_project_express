const router = require('express').Router();
const clothingItem = require('./clothingItem');

router.use('/items', clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: 'error in index.js route error' });
});
module.exports = router;
