const MyOrder = require("../models/myOrders");

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { email, products, totalPrice } = req.body;

    // Validate required fields
    if (!email || !products || products.length === 0 || !totalPrice) {
      return res.status(400).json({ message: "Missing required order data." });
    }

    // Create new order
    const newOrder = new MyOrder({
      email,
      products,
      totalPrice,
      status: "pending" // default status
    });

    // Save to DB
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error while creating order." });
  }
};

