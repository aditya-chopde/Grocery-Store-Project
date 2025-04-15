const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/verify-email/:token', userController.verifyEmail);

module.exports = router;
