const express = require('express');
const router = express.Router();
const myOrderController = require('../controllers/myOrders');

router.post("/create-order", myOrderController.createOrder);


module.exports = router;
