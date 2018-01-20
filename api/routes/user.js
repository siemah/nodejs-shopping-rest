let router = require('express').Router();
let checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.login);

router.delete('/:_id', checkAuth, UserController.delete);

module.exports = router;