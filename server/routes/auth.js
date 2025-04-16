const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail } = require('../controllers/user');
const shopController = require('../controllers/shop');

// User Login and Signup Routes
router.post('/user/signup', signup);
router.post('/user/login', login);

// Shop Signup and Login Route
router.post('/shop/signup', shopController.signup);
router.post('/shop/login', shopController.login);
router.get('/shop/verify-email/:token', shopController.verifyEmail);

// Verify Email
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
