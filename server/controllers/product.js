const Product = require("../models/product");

exports.getShopProducts = async (req, res, next) => {
  try {
    const {shopname} = req.params;
    const products = await Product.find({shopName: shopname});
    res.json({data: products});
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({data: products});
  } catch (err) {
    next(err);
  }
} 

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({data: product});
  }
  catch (err) {
    next(err);
  }
}

exports.addProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({message: "Data Uptaded Successfully", data: updated});
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


exports.getNearestStoreProducts = async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const nearestShop = await Shop.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)] // Note: [lng, lat]
          },
          $maxDistance: 10000 // optional: within 10km radius
        }
      }
    });

    if (!nearestShop) {
      return res.status(404).json({ message: "No nearby shops found" });
    }

    const products = await Product.find({ shopName: nearestShop.shopName });

    res.json({ shop: nearestShop.shopName, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      stock: product.stock
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product stock',
      error: error.message
    });
  }
};
