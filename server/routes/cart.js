const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

router.post('/add', cartController.addItemCart);
router.post('/remove', cartController.removeCartItem);
router.get("/cart/:email", cartController.getCartItems);


module.exports = router;
