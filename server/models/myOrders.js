const mongoose = require("mongoose");

const OrderProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  category: { type: String }
});

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    products: { type: [OrderProductSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const MyOrders = mongoose.model("Order", OrderSchema);

module.exports = MyOrders;
