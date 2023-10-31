const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
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
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Email is invalid'
      }
    },
    password: {
      type: String,
      required: true,
      select: false
    }
})

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          return user;
        });
    });
};


module.exports = mongoose.model('users' , userSchema);