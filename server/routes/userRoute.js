const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const usersController = require('../controllers/userController');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/me', checkAuth, usersController.getMe);
router.get('/:id', usersController.getUserById);
router.post(
  '/signup',
  [
    check('username')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);
router.post('/send-verification', usersController.sendVerificationCode);
router.post('/verify-email', usersController.verifyEmail);
router.post('/forgot-password', usersController.forgotPassword);
router.put('/reset-password/:resetToken', usersController.resetPassword);
module.exports = router;
