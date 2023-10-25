const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Link user input is invalid',
      },
    },
})

module.exports = ('users' , userSchema);