const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Link user input is invalid',
    },
  },
});

module.exports = mongoose.model('clothingItems', clothingItem);
