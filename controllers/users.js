// const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ERRORS = require('../utils/errors');
const { JWT_SECRET} = require('../utils/config')



const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  Users.findOne({ email })
  .then(user => {
      if (user) {
          return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: "User with this email already exists." });
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
  console.log('Getting current users...');
  console.log('User ID from request:', req.user._id);
  const {userId} = req.params;

   Users.findById(userId)
   .then(user => res.send({ data: user }))
   .catch(err => {
       if (err.name === 'ValidationError' || err.name === 'CastError') {
           return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
       }
       return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
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

  return Users.findUserByCredentials({ email }).select('+password')
  .then(user => {
    if(!user) {
      throw new Error('Invalid email or password');
    }

    return bcrypt.compare(password, user.password)
    .then(match => {
      if(!match) {
        throw new Error('Invalid email or passowrd')
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d'});
      res.send({ token });
    });
  })
  .catch(err => {
    if (err.message === 'Invalid email or password') {
      return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message:ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
    }
    return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  })
}


module.exports = {
  createUser,
  login,
  getCurrentUsers,
  updateUser
};