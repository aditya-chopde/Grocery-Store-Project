// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  oldPrice: Number,
  shopName: String,
  featured: Boolean,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema); 
module.exports = Product;
