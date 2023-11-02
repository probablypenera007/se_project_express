
// const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ERRORS = require('../utils/errors');
const { JWT_SECRET} = require('../utils/config')
// eslint-disable-next-line import/order
const validator = require('validator');


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: "Email and password are required." });
}

  Users.findOne({ email })
  .then(user => {
      if (user) {
          return res.status(ERRORS.CONFLICT.STATUS).send({ message: ERRORS.CONFLICT.DEFAULT_MESSAGE });
      }
      return bcrypt.hash(password, 10);
  })
  .then(hash => Users.create({ name, avatar, email, password: hash }))
  .then(newUser => {
      res.send({
          name: newUser.name,
          avatar: newUser.avatar,
          email: newUser.email
      });
  })
  .catch(err => {
      if (err.name === 'ValidationError' || err.code === 11000) {
          return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: err.message });
      }
      return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  });
};

const getCurrentUsers = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Getting current users...');
  console.log('User ID from request eto na yun!:', req.user._id);
  const userId = req.user._id;

   Users.findById(userId)
   .orFail()
   .then(user => {
    console.log("User data retrieved:", user)
    res.send({ data: user })
   })
   .catch(err => {
    console.error(err)
       if (err.name === 'ValidationError' || err.name === 'CastError') {
           return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
       }  if (err.name === 'DocumentNotFoundError') {
        return res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE});
      }
       return res
       .status(ERRORS.INTERNAL_SERVER_ERROR.STATUS)
       .send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
   });
};

const updateUser = (req, res) => {
  console.log('Updating user...');
  console.log('User data from request:', req.body);
  const { name, email, avatar } = req.body;

 return Users.findByIdAndUpdate(req.user._id, {name, email, avatar}, {new:true})
  .then(user => {
    if (!user) {
      throw new Error(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
    }
    res.send({ data: user });
  })
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: err.message });
    }
   return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE});
  });
}

const login = (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: "Email and password are required." });
}

if (!validator.isEmail(email)) {
  return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: "Email Format is Invalid." });
}

 Users.findUserByCredentials( email, password )
  // .select('+password')
  .then(user => {
    // if(!user) {
    //   throw new Error('Invalid email or password');
    // }

    // return bcrypt.compare(password, user.password)
    // .then(match => {
    //   if(!match) {
    //     throw new Error('Invalid email or passowrd')
    //   }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d'});
      res.send({ token })
//    });
 })
  .catch(err => {
    console.error(err);
 //   return res.status(400).send({ message: "Testing 400 status" });
    if (err.name === 'Invalid email or password' || err.name === 'ValidationError' ||  err.name === 'Error') {
      return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message:ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(ERRORS.NOT_FOUND.STATUS)
                .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
    }
    // console.error("Unexpected error during login:", err);
    return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  });
}


module.exports = {
  createUser,
  login,
  getCurrentUsers,
  updateUser
};