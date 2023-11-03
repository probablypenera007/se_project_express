const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Users = require('../models/user');
const ERRORS = require('../utils/errors');
const { JWT_SECRET} = require('../utils/config');



const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.send(ERRORS.BAD_REQUEST.STATUS).send({ message: "Email and password are required." });
  }

  return Users.findOne({ email })
  .then((user) => {
    if(user) {
      throw new Error('User already exists')
      // return res.status(ERRORS.CONFLICT.STATUS)
      // .send({ message: ERRORS.CONFLICT.DEFAULT_MESSAGE })
    }
 return bcrypt.hash(password, 10)
  })
    .then(hash => Users.create({ name, avatar, email, password: hash }))
    .then(newUser => res.send({
          name: newUser.name,
          avatar: newUser.avatar,
          email: newUser.email
      }))
    .catch(err => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.BAD_REQUEST.STATUS).send({ message: err.message });
      }
      if (err.message === 'User already exists') {
        return res.status(ERRORS.CONFLICT.STATUS).send({ message: ERRORS.CONFLICT.DEFAULT_MESSAGE });
      }

      return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
    })
// })
}
  // .catch(() => res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE }));
// }


const getCurrentUsers = (req, res) => {

  // console.log('Getting current users...');
  // console.log('User ID from request eto na yun!:', req.user._id);
  const userId = req.user._id;

   Users.findById(userId)
   .orFail()
   .then(user => {
 //   console.log("User data retrieved:", user)
    res.send({ data: user })
   })
   .catch(err => {
    // console.error(err)
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
  // console.log('Updating user...');
  // console.log('User data from request:', req.body);
  const { name, avatar } = req.body;

 return Users.findByIdAndUpdate(req.user._id, {name, avatar}, {new:true, runValidators: true})
  .then(user => {
    if (!user) {
      return res.status(ERRORS.NOT_FOUND.STATUS).send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
    }
   return res.send({ data: user });
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

 return Users.findUserByCredentials( email, password )
  .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d'});
      res.send({ token })
 })
  .catch(err => {
    if (err.name === 'Invalid email or password') {
      return res.status(ERRORS.UNAUTHORIZED.STATUS).send({ message:ERRORS.BAD_REQUEST.DEFAULT_MESSAGE });
    }
    return res.status(ERRORS.INTERNAL_SERVER_ERROR.STATUS).send({ message: ERRORS.INTERNAL_SERVER_ERROR.DEFAULT_MESSAGE });
  });
}


module.exports = {
  createUser,
  login,
  getCurrentUsers,
  updateUser
};