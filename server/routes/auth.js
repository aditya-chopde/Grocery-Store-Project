const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/user');
const shopController = require('../controllers/shop');

// User Login and Signup Routes
router.post('/user/signup', signup);
router.post('/user/login', login);

// Shop Signup and Login Route
router.post('/shop/signup', shopController.signup);
router.post('/shop/login', shopController.login);

module.exports = router;
