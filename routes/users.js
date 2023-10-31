const router = require('express').Router();
 const {auth} = require('../middlewares/auth')
 const {
 getCurrentUsers,
 updateUser,
 } = require('../controllers/users');

// CRUD

// Create
// router.post('/', createUser);


// Read
// router.get('/', getUsers);
router.get('/users/me', getCurrentUsers);
//  router.get('/users/me', getCurrentUsers);
// router.get('/users/me', (req, res, next) => {
//   console.log("GET /users/me route triggered");
//   getCurrentUsers(req,res,next);
// });



// Read
// router.get('/:userId', getMainUser);

// Update
// router.patch('/users/me', auth, updateUser);
// router.use(auth)
 router.patch('/users/me', auth, updateUser);

module.exports = router;