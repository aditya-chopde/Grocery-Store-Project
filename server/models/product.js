// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  category: String,
  description: String,
  image: String,
  oldPrice: Number,
  shopName: { type: String, required: true },
  featured: Boolean,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema); 
module.exports = Product;
