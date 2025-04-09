const MyOrders = require('../models/myOrders');
const Product = require('../models/product');

// Helper function to validate order items
const validateOrderItems = async (products) => {
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (item.quantity > product.stock) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { email, products, totalPrice, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!email || !products || !totalPrice || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate order items
    await validateOrderItems(products);

    // Get shop names from products
    const productDocs = await Product.find({
      _id: { $in: products.map(p => p.productId) }
    });
    const shopNames = [...new Set(productDocs.map(p => p.shopName))];

    // Create new order with shop references
    const order = new MyOrders({
      email,
      products: products.map(p => ({
        ...p,
        status: 'pending' // Initialize status
      })),
      shops: shopNames,
      totalPrice,
      shippingAddress,
      paymentMethod
    });

    // Save order
    const savedOrder = await order.save();

    // Update product stocks
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// Get orders by user email
exports.getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const orders = await MyOrders.find({ email })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name price image');

    res.status(200).json({
      data: {
        success: true,
        count: orders.length,
        orders
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get orders for a specific shop
exports.getShopOrders = async (req, res) => {
  try {
    const { shopName } = req.params;
    const { status } = req.query;

    const filter = { shops: shopName };
    if (status) filter['products.status'] = status;

    const orders = await MyOrders.find(filter)
      .populate('products.productId', 'name price shopName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: {
        success: true,
        count: orders.length,
        orders
      }
    });

  } catch (error) {
    console.error('Error fetching shop orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop orders'
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const orders = await MyOrders.find(filter)
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Update item status in an order
exports.updateItemStatus = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!orderId || !productId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Product ID and status are required'
      });
    }

    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        validStatuses
      });
    }

    const order = await MyOrders.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Find the specific item
    const itemIndex = order.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in order'
      });
    }

    // Check status transition validity
    const currentStatus = order.products[itemIndex].status;
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${currentStatus} to ${status}`,
        validTransitions: validTransitions[currentStatus]
      });
    }

    // Update status
    order.products[itemIndex].status = status;
    const updatedOrder = await order.save();

    // If all items are delivered, mark order as delivered
    if (status === 'delivered') {
      const allDelivered = updatedOrder.products.every(
        item => item.status === 'delivered'
      );
      if (allDelivered) {
        updatedOrder.status = 'delivered';
        await updatedOrder.save();
      }
    }

    res.status(200).json({
      data: {
        success: true,
        message: 'Item status updated',
        order
      }
    });

  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item status'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required'
      });
    }

    const updatedOrder = await MyOrders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).populate('products.productId', 'name price');

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await MyOrders.findById(orderId)
      .populate('products.productId', 'name price image description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};
