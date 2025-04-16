const express = require('express');
const router = express.Router();
const myOrdersController = require('../controllers/myOrders');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', myOrdersController.createOrder);

// @route   GET /api/orders/shop/:shopName
// @desc    Get orders for a specific shop
// @access  Private/ShopAdmin
router.get('/shop/:shopName', myOrdersController.getShopOrders);

// @route   GET /api/orders/user/:email
// @desc    Get orders by user email
// @access  Private
router.get('/user/:email', myOrdersController.getUserOrders);

// @route   GET /api/orders/:orderId
// @desc    Get order details
// @access  Private
router.get('/:orderId', myOrdersController.getOrderDetails);

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', myOrdersController.getAllOrders);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:orderId/status', myOrdersController.updateOrderStatus);

// @route   PUT /api/orders/:orderId/items/:productId/status
// @desc    Update item status in an order (ShopAdmin only)
// @access  Private/ShopAdmin
router.put('/:orderId/items/:productId/status', myOrdersController.updateItemStatus);

router.post("/add/address", myOrdersController.addAddress);
router.get("/get/address/:email", myOrdersController.fetchAddressDetails);

module.exports = router;
